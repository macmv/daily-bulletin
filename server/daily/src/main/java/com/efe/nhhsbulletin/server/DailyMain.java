package com.efe.nhhsbulletin.server;

import java.util.Date;
import java.util.logging.Logger;

public class DailyMain {
  private static final Logger log = Logger.getLogger(DailyMain.class.getName());

  public static void main(String[] args) {
//    bulletin.collectDaily();
//    String data = "hello";
    S3Manager s3Manager = new S3Manager("daily-bulletin");
    BulletinCache bulletinCache = new BulletinCache(s3Manager, new Date());
    bulletinCache.readCache();
    log.info("Loaded cache: " + bulletinCache.getJsonData());
    SportsCache sportsCache = new SportsCache(s3Manager, new Date());
    sportsCache.parseFromBulletin(bulletinCache);
//    InputStream is = new ByteArrayInputStream(data.getBytes(), 0, data.getBytes().length);
//    new S3Manager("daily-bulletin").write("v0/bulletin/2019-09/13.json", is);
  }
}
