package com.efe.nhhsbulletin.server;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.parser.Parser;

import javax.mail.BodyPart;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.logging.Logger;
import java.util.regex.Pattern;

public class BulletinManager {
  private static final Logger log = Logger.getLogger(BulletinManager.class.getName());
  private static final DateFormat dateFormat = new SimpleDateFormat("yyyy-MM/dd");
  private final S3Manager s3Manager;
  // NOTE: these are not spaces. They're \u00A0, which is not the same.
  // Also, java.util.regex sucks, becuase \s, which should match whitespace, does not match \u00a0.
  // See: https://stackoverflow.com/questions/4731055/whitespace-matching-regex-java
  private final static Pattern emailSubjectPattern = Pattern.compile("^\\[Hale-Mail]   \\d+\\.\\d+\\.\\d+  Nathan Hale Daily Bulletin\\s*$");

  public BulletinManager(String bucketName) {
    s3Manager = new S3Manager(bucketName);
  }

  private static String getBasePath() {
    return "./cache/bulletin/";
  }

  private static String getKeyName(Date date) {
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

  public void parseEmail(String emailRaw) {
    Session s = Session.getInstance(new Properties());
    InputStream is = new ByteArrayInputStream(emailRaw.getBytes());
    MimeMessage message;
    String content = null;
    String subject;
    try {
      message = new MimeMessage(s, is);
      MimeMultipart contentParts = (MimeMultipart) message.getContent();
      subject = message.getSubject();
      for (int i = 0; i < contentParts.getCount(); i++) {
        BodyPart part = contentParts.getBodyPart(i);
        if (part.isMimeType("text/plain")) {
          content = (String) part.getContent();
        }
      }
    } catch (MessagingException | IOException e) {
      e.printStackTrace();
      System.exit(1);
      return;
    }
    log.info("Got email subject: " + subject);
    boolean matches = emailSubjectPattern.matcher(subject).matches();
    if (!emailSubjectPattern.matcher(subject).matches()) {
      log.warning("Subject of email does not match bulletin regex");
      System.exit(0);
    }
    if (content == null) {
      log.severe("No text/plain content was found");
      System.exit(1);
    }
    Date date = parseDateFromSubject(subject);
    log.info("Got date from subject: " + date);
    BulletinCache cache = new BulletinCache(s3Manager, date);
    cache.readEmail(content);
    log.info("Saving cache to S3");
    cache.saveCache();
  }

  public void collectEmail(String messageId) {
    log.info("Got email id: " + messageId);
    String emailRaw = s3Manager.read("v0/email/" + messageId);

    parseEmail(emailRaw);
  }

  public Date parseDateFromSubject(String subject) {
    int month = -1, day = -1, year = -1;
    for (int i = 0; i < subject.length(); i++) {
      char let = subject.charAt(i);
      int startIndex = i;
      if (Character.isDigit(let)) {
        for (int j = i; j < subject.length(); j++) {
          char endLet = subject.charAt(j);
          if (!Character.isDigit(endLet)) {
            int value = Integer.parseInt(subject.substring(startIndex, j));
            if (month == -1) {
              month = value;
            } else if (day == -1) {
              day = value;
            } else if (year == -1) {
              year = value;
            }
            i = j;
            break;
          }
        }
      }
    }
    Calendar c = Calendar.getInstance();
    c.set(year, month - 1, day);
    return new Date(c.getTimeInMillis());
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
     * Loads data from nhhs website into jsonData
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
      plainTextData = Parser.unescapeEntities(plainTextData, true);
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
