package com.efe.nhhsbulletin.server;

public class DailyMain {

  public static void main(String[] args) {
    BulletinManager bulletin = new BulletinManager("daily-bulletin");
    bulletin.collectDaily();
//    String data = "hello";
//    InputStream is = new ByteArrayInputStream(data.getBytes(), 0, data.getBytes().length);
//    new S3Manager("daily-bulletin").write("v0/bulletin/2019-09/13.json", is);
  }
}
