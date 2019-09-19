package com.efe.nhhsbulletin.android;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.TabLayout;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.PopupMenu;
import android.widget.TextView;

import com.efe.nhhsbulletin.android.connection.ServerConnection;
import com.efe.nhhsbulletin.android.ui.main.SectionsPagerAdapter;

public class MainActivity extends AppCompatActivity {

    private static final String TAG = MainActivity.class.getSimpleName();
    private static Context appContext;
    private ServerConnection server;

    //get application context outside of main activity
    public static Context getAppContext() {
        return appContext;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        //app context
        appContext = getApplicationContext();

//        List<Date> dates = new ServerConnection().getBulletinManager().getBulletin(new Date());
        //BulletinManager.BulletinInfo info = new ServerConnection().getBulletinManager().getBulletin(new Date());
//        for (Date d : dates) {
//            Log.i(TAG, "date: " + d);
//        }
        //Log.i(TAG, info.getClubs());
        SectionsPagerAdapter sectionsPagerAdapter = new SectionsPagerAdapter(this, getSupportFragmentManager());
        ViewPager viewPager = findViewById(R.id.view_pager);
        viewPager.setAdapter(sectionsPagerAdapter);
        TabLayout tabs = findViewById(R.id.tabs);
        tabs.setupWithViewPager(viewPager);
        server = new ServerConnection();
        /*FloatingActionButton fab = findViewById(R.id.fab);

        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
            }
        });*/

    }

    //show settings when Settings button is pressed
    public void showSettings(MenuItem item) {
        Intent intent = new Intent(this, SettingsActivity.class);
        startActivity(intent);
    }

    public void createOptionsMenu(View view) {
        Log.i(TAG, "createOptionsMenu: called!");
        PopupMenu popupMenu = new PopupMenu(this, view);
        popupMenu.getMenuInflater().inflate(R.menu.settings_dropdown, popupMenu.getMenu());
        popupMenu.show();
    }

    public void hideSchoolName() {
        //get high school name at bottom of screen
        final TextView schoolNameView = findViewById(R.id.high_school_name);
        schoolNameView.setVisibility(View.GONE);
    }

    public void showSchoolName() {
        //get high school name at bottom of screen
        final TextView schoolNameView = findViewById(R.id.high_school_name);
        schoolNameView.setVisibility(View.VISIBLE);
    }


    public ServerConnection getServer() {
        return server;
    }

    /*@Override
    public boolean onCreateOptionsMenu(Menu menu) {
        Log.i(TAG, "onCreateOptionsMenu: called!");
        // Inflate the settings_dropdown; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.settings_dropdown, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        Log.i(TAG, "onOptionsItemSelected: called!");
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_name) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }*/
}