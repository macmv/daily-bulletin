package com.efe.nhhsbulletin.server;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.logging.Logger;
import java.util.regex.Pattern;

public class SportsCache {
  private static final Logger log = Logger.getLogger(SportsCache.class.getName());
  private final S3Manager s3Manager;
  private final Date date;
  private final Pattern sportsStartsWithDate = Pattern.compile("^[A-Z][a-z]+, [0-9]+/[0-9]+:");
  private final DateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy");

  public SportsCache(S3Manager s3Manager, Date date) {
    this.date = date;
    this.s3Manager = s3Manager;
  }

  public void parseFromBulletin(BulletinCache bulletinCache) {
    String json = bulletinCache.getJsonData();
    JSONObject bulletinData = new JSONObject(json);
    List sportsRaw = ((JSONArray) bulletinData.get("sports")).toList();
    if (sportsRaw.get(0).equals("Happenings")) {
      sportsRaw.remove(0);
    }
    log.info("Got sports:" + sportsRaw);
    Map<Date, List<String>> data = new HashMap<>();
    Date thisDate = new Date();
    sportsRaw.forEach(o -> {
      String line = o.toString();
      int startDataString = 0;
      if (sportsStartsWithDate.matcher(line).find()) {
        int startDate = line.split(", ")[0].length() + 2;
        int endDate = line.split(": ")[0].length();
        Calendar cal = Calendar.getInstance();
        cal.setTime(bulletinCache.getDate());
        String dateStr = line.substring(startDate, endDate) + "/" + cal.get(Calendar.YEAR);
        log.info("Parsed str date from line: " + dateStr);
        try {
          thisDate.setTime(dateFormat.parse(dateStr).getTime());
        } catch (ParseException e) {
          log.severe("This should not have been called!\nWe have a regex to match a valid date, so that should protect against this.");
          System.exit(1);
        }
        log.info("Parsed date from line: " + thisDate);
        startDataString = endDate + 2;
      }
      if (!data.containsKey(thisDate)) {
        data.put(thisDate, new ArrayList<>());
      }
      data.get(thisDate).add(line.substring(startDataString));
    });
    log.info("Generated data: " + data);
  }
}
