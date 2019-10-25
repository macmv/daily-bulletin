package com.efe.nhhsbulletin.server;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayInputStream;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.logging.Logger;
import java.util.regex.Pattern;

public class SportsCache {
  private static final Logger log = Logger.getLogger(SportsCache.class.getName());
  private final S3Manager s3Manager;
  private final Pattern sportsStartsWithDate = Pattern.compile("^[A-Z][a-z]+, [0-9]+/[0-9]+:");
  private final DateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy");
  private final DateFormat jsonDateFormat = new SimpleDateFormat("yyyy-MM/dd");
  private final Map<String, List<String>> data = new HashMap<>();

  public SportsCache(S3Manager s3Manager) {
    this.s3Manager = s3Manager;
  }

  public void parseFromBulletin(BulletinCache bulletinCache) {
    String bulletinJson = bulletinCache.getJsonData();
    JSONObject bulletinData = new JSONObject(bulletinJson);
    List sportsRaw = ((JSONArray) bulletinData.get("sports")).toList();
    if (sportsRaw.get(0).equals("Happenings")) {
      sportsRaw.remove(0);
    }
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
        try {
          thisDate = dateFormat.parse(dateStr);
        } catch (ParseException e) {
          log.severe("This should not have been called!\nWe have a regex to match a valid date, so that should protect against this.");
          System.exit(1);
        }
        startDataString = endDate + 2;
      }
      // because everything is terrible and i cant reassign thisDate in forEach
      String dateStr = jsonDateFormat.format(thisDate);
      if (!data.containsKey(dateStr)) {
        data.put(dateStr, new ArrayList<>());
      }
      data.get(dateStr).add(line.substring(startDataString).trim());
    }
  }

  public void saveCache() {
    data.forEach((dateStr, eventsList) -> {
      JSONObject events = new JSONObject();
      events.put("events", eventsList);
      String eventsJson = events.toString();
      log.info("Saving json for date " + dateStr + ":\n" + eventsJson);
      ByteArrayInputStream is = new ByteArrayInputStream(eventsJson.getBytes(), 0, eventsJson.getBytes().length);
      s3Manager.write(getKeyName(dateStr), is);
    });
  }

  private static String getKeyName(String date) {
    return "v0/sports/" + date + ".json";
  }
}
