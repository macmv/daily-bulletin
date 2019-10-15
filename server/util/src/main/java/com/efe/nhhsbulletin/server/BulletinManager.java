package com.efe.nhhsbulletin.server;

import org.apache.commons.lang3.StringUtils;

import javax.mail.BodyPart;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.logging.Logger;
import java.util.regex.Pattern;

public class BulletinManager {
  private static final Logger log = Logger.getLogger(BulletinManager.class.getName());
  private final S3Manager s3Manager;
  // NOTE: these are not spaces. They're \u00A0, which is not the same.
  // Also, java.util.regex sucks, because \s, which should match whitespace, does not match \u00A0.
  // See: https://stackoverflow.com/questions/4731055/whitespace-matching-regex-java
  private final static Pattern emailSubjectPattern = Pattern.compile("^\\[Hale-Mail]   \\d+\\.\\d+\\.\\d+  Nathan Hale Daily Bulletin\\s*$");

  public BulletinManager(String bucketName) {
    s3Manager = new S3Manager(bucketName);
  }

  private static String getBasePath() {
    return "./cache/bulletin/";
  }

  public void collectDaily() {
    Date today = new Date();
    BulletinCache cache = new BulletinCache(s3Manager, today);
    // checks if no file was saved for today
    if (!cache.exists()) {
      cache.readWebsite();
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
    BulletinCache bulletinCache = new BulletinCache(s3Manager, date);
    bulletinCache.readEmail(content);
    log.info("Saving cache to S3");
    bulletinCache.saveCache();

    SportsCache sportsCache = new SportsCache(s3Manager, date);
    sportsCache.parseFromBulletin(bulletinCache);
//    sportsCache.overwriteS3();
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

}
