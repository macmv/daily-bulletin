package com.efe.nhhsbulletin.server;

import org.json.JSONArray;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.parser.Parser;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.logging.Logger;

public class BulletinCache {
  private static final Logger log = Logger.getLogger(BulletinCache.class.getName());
  private static final DateFormat dateFormat = new SimpleDateFormat("yyyy-MM/dd");
  private final Date date;
  private final S3Manager s3Manager;
  private String jsonData = null;

  public BulletinCache(S3Manager s3Manager, Date date) {
    this.date = date;
    this.s3Manager = s3Manager;
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
        List lines = Arrays.asList(section.split("\n"));
        json.put("title", lines.subList(0, 2));
        json.put("sports", lines.subList(2, lines.size()));
      } else if (section.startsWith("CLUBS:")) {
        json.put("clubs", Arrays.asList(section.split("\n")));
      } else if (section.startsWith("Lunch:")) {
        json.put("lunch", Arrays.asList(section.split("\n")));
      } else {
        if (!json.has("other")) {
          json.put("other", new JSONArray());
        }
        ((JSONArray) json.get("other")).put(section);
      }
    }
    return json.toString();
  }

  private static String getKeyName(Date date) {
    return "v0/bulletin/" + dateFormat.format(date) + ".json";
  }

  /**
   * Loads data from nhhs website into jsonData
   */
  public void readWebsite() {
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
    plainTextData = Parser.unescapeEntities(plainTextData, true);
    jsonData = generateJsonData(plainTextData).trim();
    log.info("Generated JSON: " + jsonData);
  }

  /**
   * Loads data from email content into jsonData
   */
  public void readEmail(String email) {
    jsonData = generateJsonData(email).trim();
    log.info("Generated JSON: " + jsonData);
  }

  /**
   * Gets the current data stored
   *
   * @return The current data is has stored
   */
  public String getJsonData() {
    return jsonData;
  }

  public Date getDate() {
    return date;
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
