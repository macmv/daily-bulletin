package com.efe.nhhsbulletin.server;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.logging.Logger;

public class BulletinManager {
  private static final Logger log = Logger.getLogger(BulletinManager.class.getName());
  private static final DateFormat dateFormat = new SimpleDateFormat("yyyy-MM/dd");
  private final S3Manager s3Manager;

  public BulletinManager(String bucketName) {
    s3Manager = new S3Manager(bucketName);
  }

  private static String getBasePath() {
    return "./cache/bulletin/";
  }

  public static String getKeyName(Date date) {
    return "v0/bulletin/" + dateFormat.format(date) + ".json";
  }

  public void collectDaily() {
    Date today = new Date();
    BulletinCache cache = new BulletinCache(s3Manager, today);
    // checks if no file was saved for today
    if (!cache.exists()) {
      cache.readInternet();
      BulletinCache prevCache = new BulletinCache(s3Manager, getPrevCache(today));
      prevCache.readCache();
      log.info("Diff: " + StringUtils.difference(cache.getJsonData(), prevCache.getJsonData()));
      // checks if it is the same as the prev cache, therefore it is the weekend
      if (cache.getJsonData().equals(prevCache.getJsonData())) {
        log.info("File is the same as prev cache");
      } else {
        cache.saveCache();
        log.info("Saved new cache");
      }
    } else {
      log.info("File already exists for " + today);
    }
  }

  /**
   * Gets the cache that is date or closest before
   *
   * @param date The date to scan backward from
   * @return The date of the cache found, or null if no caches in past year
   */
  private Date getPrevCache(Date date) {
    long DAY_IN_MS = 1000 * 60 * 60 * 24;
    for (int daysBack = 0; daysBack < 356; daysBack++) {
      Date testDate = new Date(date.getTime() - daysBack * DAY_IN_MS);
      BulletinCache testCache = new BulletinCache(s3Manager, testDate);
      if (testCache.exists()) {
        return testDate;
      }
    }
    return null;
  }

  public String getAvailableDates() {
    return "available dates";
  }

  private static class BulletinCache {
    private final Date date;
    private final S3Manager s3Manager;
    private String jsonData = null;

    public BulletinCache(S3Manager s3Manager, Date date) {
      this.date = date;
      this.s3Manager = s3Manager;
    }

    /**
     * Loads data from nhhs website into data
     */
    public void readInternet() {
      Document doc;
      try {
        doc = Jsoup.connect("https://halehs.seattleschools.org/about/calendar_and_news/daily_bulletin").get();
      } catch (IOException e) {
        e.printStackTrace();
        return;
      }
      Element para = doc.select("#ctl00_ContentPlaceHolder1_ctl12_divContent").get(0);
      String[] raw = para.html().split("\n");
      for (int i = 1; i < raw.length; i++) {
        raw[i] = raw[i].substring(Math.min(5, raw[i].length()));
      }
      String plainTextData = String.join("\n", raw);
      jsonData = generateJsonData(plainTextData).trim();
      log.info("Generated JSON: " + jsonData);
    }

    private static String generateJsonData(String plainTextData) {
      JSONObject json = new JSONObject();
      ArrayList<String> sections = new ArrayList<>();
      StringBuilder currentSection = null;
      for (String line : plainTextData.split("\n")) {
        if (line.equals("")) {
          if (currentSection != null) {
            sections.add(currentSection.toString());
          }
          currentSection = null;
        } else {
          if (currentSection == null) {
            currentSection = new StringBuilder();
          }
          currentSection.append(line).append("\n");
        }
      }
      for (String section : sections) {
        section = section.trim();
        if (section.startsWith("NATHAN HALE HIGH SCHOOL DAILY")) {
          json.put("title", section);
        } else if (section.startsWith("CLUBS:")) {
          json.put("clubs", section);
        } else if (section.startsWith("Happenings")) {
          json.put("sports", section);
        } else if (section.startsWith("Lunch:")) {
          json.put("lunch", section);
        } else {
          if (!json.has("other")) {
            json.put("other", new JSONArray());
          }
          ((JSONArray) json.get("other")).put(section);
        }
      }
      return json.toString();
    }

    /**
     * Gets the current data stored
     * @return The current data is has stored
     */
    public String getJsonData() {
      return jsonData;
    }

    public boolean exists() {
      return s3Manager.exists(getKeyName(date));
    }

    public void readCache() {
      jsonData = s3Manager.read(getKeyName(date)).trim();
    }

    public void saveCache() {
      ByteArrayInputStream is = new ByteArrayInputStream(jsonData.getBytes(), 0, jsonData.getBytes().length);
      s3Manager.write(getKeyName(date), is);
    }
  }
}
