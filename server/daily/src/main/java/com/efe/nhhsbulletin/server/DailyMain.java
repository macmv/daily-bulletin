package com.efe.nhhsbulletin.server;

public class DailyMain {
  public static void main(String[] args) {
    BulletinManager bulletin = new BulletinManager();
    bulletin.collectDaily();
  }
}
