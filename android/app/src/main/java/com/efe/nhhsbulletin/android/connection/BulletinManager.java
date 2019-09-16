package com.efe.nhhsbulletin.android.connection;

import android.os.AsyncTask;
import android.util.Log;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Queue;
import java.util.concurrent.ExecutionException;

public class BulletinManager {
    public static final String TAG = BulletinManager.class.getSimpleName();

    private final S3Manager s3Manager;
    private DateFormat monthDateFormat = new SimpleDateFormat("yyyy-MM");
    private DateFormat dateFormat = new SimpleDateFormat("yyyy-MM/dd");

    public BulletinManager(String bucketName) {
        s3Manager = new S3Manager(bucketName);
    }

    private static String getBaseKey() {
        return "v0/bulletin/";
    }

    public List<Date> getAvailableDates(Date month) {
        final Date m = month;
        final List<String> files = new ArrayList<>();
        try {
            new RunInBackground(new Runnable() {
                @Override
                public void run() {
                    files.addAll(s3Manager.list(getBaseKey() + monthDateFormat.format(m)));
                }
            }).execute().get();
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
        }
        List<Date> dates = new ArrayList<>();
        for (String fileName : files) {
            if (fileName.endsWith(".json")) {
                try {
                    Date d = dateFormat.parse(fileName.substring(fileName.length() - 15, fileName.length() - 5));
                    dates.add(d);
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }
        }
        return dates;
    }

    private static class RunInBackground extends AsyncTask<Void, Void, Void> {

        private final Runnable task;

        public RunInBackground(Runnable task) {
            this.task = task;
        }

        @Override
        protected Void doInBackground(Void... voids) {
            task.run();
            return null;
        }
    }
}
