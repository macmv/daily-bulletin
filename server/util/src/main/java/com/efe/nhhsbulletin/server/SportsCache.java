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
  private final DateFormat jsonDateFormat = new SimpleDateFormat("yyyy-dd-MM");

  public SportsCache(S3Manager s3Manager, Date date) {
    this.date = date;
    this.s3Manager = s3Manager;
  }

  public void parseFromBulletin(BulletinCache bulletinCache) {
    String bulletinJson = bulletinCache.getJsonData();
    JSONObject bulletinData = new JSONObject(bulletinJson);
    List sportsRaw = ((JSONArray) bulletinData.get("sports")).toList();
    if (sportsRaw.get(0).equals("Happenings")) {
      sportsRaw.remove(0);
    }
    log.info("Got sports:" + sportsRaw);
    Map<String, List<String>> data = new HashMap<>();
    Date thisDate = null;
    for (Object o : sportsRaw) {
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
          thisDate = dateFormat.parse(dateStr);
        } catch (ParseException e) {
          log.severe("This should not have been called!\nWe have a regex to match a valid date, so that should protect against this.");
          System.exit(1);
        }
        log.info("Parsed date from line: " + thisDate);
        startDataString = endDate + 2;
      }
      // because everything is terrible and i cant reassign thisDate in forEach
      String dateStr = jsonDateFormat.format(thisDate);
      if (!data.containsKey(dateStr)) {
        data.put(dateStr, new ArrayList<>());
      }
      data.get(dateStr).add(line.substring(startDataString).trim());
    }
    String sportsJson = new JSONObject(data).toString(2);
    log.info("Generated data:\n" + data.toString().replaceAll("], ", "],\n"));
    log.info("Generated json:\n" + sportsJson);
  }
}
