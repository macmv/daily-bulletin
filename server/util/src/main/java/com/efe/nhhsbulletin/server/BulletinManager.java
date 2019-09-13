package com.efe.nhhsbulletin.server;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONString;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.logging.Logger;

public class BulletinManager {
  private final static Logger log = Logger.getLogger(BulletinManager.class.getName());
  DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

  public BulletinManager() {

  }

  public void collectDaily() {
    Date today = new Date();
    BulletinCache cache = new BulletinCache(today);
    cache.readInternet();
    if (cache.getJsonData().length() > 0) {
      cache.saveCache();
    }
  }

  public String getAvailableDates() {
    return "available dates";
  }

  public String getDate(String query) {
    String[] date_data = query.split("&"); // is ['d=2019-09-12']
    Date date;
    if (date_data.length == 1) {
      String[] date_raw = date_data[0].split("="); // is ['d, '2019-09-12']
      if (date_raw.length == 2 && date_raw[0].equals("d")) {
        String date_value = date_raw[1]; // is '2019-09-12'
        date = getDateFromString(date_value);
        if (date == null) {
          return "invalid date";
        }
      } else {
        return "invalid request";
      }
    } else {
      return "invalid request";
    }
    BulletinCache cache = getBulletinCache(date);
    return cache.getJsonData();
  }

  private BulletinCache getBulletinCache(Date date) {
    BulletinCache cache = new BulletinCache(date);
    cache.readCache();
    return cache;
  }

  private class BulletinCache {
    private final Date date;
    private String jsonData = null;

    public BulletinCache(Date date) {
      this.date = date;
    }

    /**
     * Loads the local cache into data
     */
    public void readCache() {
      try {
        Path p = Paths.get(getBasePath() + getPathFromDate(date));
        if (!Files.exists(p)) {
          jsonData = null;
          return;
        }
        StringBuilder sb = new StringBuilder();
        Files.lines(p).forEach((s) -> {
          sb.append(s).append("\n");
        });
        jsonData = sb.toString();
      } catch (IOException e) {
        e.printStackTrace();
      }
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
      jsonData = generateJsonData(plainTextData);
      log.info("Generated JSON: " + jsonData);
    }

    private String generateJsonData(String plainTextData) {
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
            json.put("other", section);
          }
        }
      }
      return json.toString();
    }

    /**
     * Saves the data it has to the appropriate file
     */
    public void saveCache() {
      Path p = Paths.get(getBasePath() + getPathFromDate(date));
      if (Files.exists(p)) {
        log.info("File already exists for " + date);
        return;
      }
      try {
        Files.write(p, jsonData.getBytes());
      } catch (IOException e) {
        e.printStackTrace();
      }
      log.info("Saved file for " + date);
    }

    /**
     * Gets the current data stored
     * @return The current data is has stored
     */
    public String getJsonData() {
      return jsonData;
    }
  }

  private String getPathFromDate(Date date) {
    return dateFormat.format(date) + ".txt";
  }

  private Date getDateFromString(String str) {
    try {
      return dateFormat.parse(str);
    } catch (ParseException e) {
      return null;
    }
  }

  private static String getBasePath() {
    return "./cache/bulletin/";
  }
}
