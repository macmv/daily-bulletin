package com.efe.nhhsbulletin.android.connection;

import android.os.AsyncTask;

import java.net.URL;

public class ServerConnection {
    private final BulletinManager bulletinManager;

    public ServerConnection() {
        bulletinManager = new BulletinManager("daily-bulletin");
    }

    public BulletinManager getBulletinManager() {
        return bulletinManager;
    }
}
