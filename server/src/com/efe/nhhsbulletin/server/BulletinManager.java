package com.efe.nhhsbulletin.server;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class BulletinManager {
  DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

  public BulletinManager() {

  }

  public String getAvailableDates() {
    return "available dates";
  }

  public String getDate(String query) {
    String[] date_data = query.split("&"); // is ['date=2019-09-12']
    Date date;
    if (date_data.length == 1) {
      String[] date_raw = date_data[0].split("="); // is ['date, '2019-09-12']
      if (date_raw.length == 2) {
        String date_value = date_raw[1]; // is '2019-09-12'
        date = getDateFromString(date_value);
        if (date == null) {
          return "invalid date";
        }
      } else {
        return "invalid date";
      }
    } else {
      return "invalid date";
    }
    BulletinCache cache = getBulletinCache(date);
    return cache.getData();
  }

  private BulletinCache getBulletinCache(Date date) {
    BulletinCache cache = new BulletinCache(date);
    cache.readCache();
    return cache;
  }

  private class BulletinCache {
    private final Date date;
    private String data;

    public BulletinCache(Date date) {
      this.date = date;
    }

    public void readCache() {
      try {
        Path p = Paths.get(getBaseBulletinCachePath() + getPathFromDate(date));
        System.out.println(p.toAbsolutePath());
        StringBuilder sb = new StringBuilder();
        Files.lines(p).forEach((s) -> {
          sb.append(s).append("\n");
        });
        data = sb.toString();
      } catch (IOException e) {
        e.printStackTrace();
      }
    }

    public void readInternet() {

    }

    public void saveCache() {

    }

    public String getData() {
      return data;
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

  private static String getBaseBulletinCachePath() {
    return "./cache/bulletin/";
  }
}
