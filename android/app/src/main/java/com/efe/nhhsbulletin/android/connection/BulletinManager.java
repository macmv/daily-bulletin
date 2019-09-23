package com.efe.nhhsbulletin.android.connection;

import android.os.AsyncTask;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ExecutionException;

public class BulletinManager {
    public static final String TAG = BulletinManager.class.getSimpleName();

    private final S3Manager s3Manager;
    private DateFormat monthDateFormat = new SimpleDateFormat("yyyy-MM");
    private DateFormat dayDateFormat = new SimpleDateFormat("yyyy-MM/dd");

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
            //TODO: replace Runnable with lambda
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
                    Date d = dayDateFormat.parse(fileName.substring(fileName.length() - 15, fileName.length() - 5));
                    dates.add(d);
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }
        }
        return dates;
    }

    public void getBulletin(Date date, BulletinInfoReceived task) {
        final Date d = date;
        Log.i(TAG, "getBulletin: Grabbing day: " + date);
        new RunInBackground(() -> {
            task.onReceive(new BulletinInfo(s3Manager.read(getBaseKey() + dayDateFormat.format(d) + ".json")));
        }).execute();
    }

    public interface BulletinInfoReceived {
        void onReceive(BulletinInfo info);
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

    public class BulletinInfo {
        private String title;
        private String clubs;
        private String sports;
        private String lunch;
        private List<String> other;

        BulletinInfo(String data) {
            JSONObject json;
            try {
                json = new JSONObject(data);
                title = (String) json.get("title");
                clubs = (String) json.get("clubs");
                sports = (String) json.get("sports");
                lunch = (String) json.get("lunch");
                JSONArray otherArr = (JSONArray) json.get("other");
                other = new ArrayList<>();
                for (int i = 0; i < otherArr.length(); i++) {
                    other.add(otherArr.get(i).toString());
                }
            } catch (JSONException e) {
                Log.w(TAG, "When parsing json, " + Arrays.toString(e.getStackTrace()));
            }
        }

        public String getTitle() {
            return title;
        }

        public String getClubs() {
            return clubs;
        }

        public String getSports() {
            return sports;
        }

        public String getLunch() {
            return lunch;
        }

        public List<String> getOther() {
            return other;
        }
    }
}
