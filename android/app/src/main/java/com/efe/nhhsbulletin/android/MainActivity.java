package com.efe.nhhsbulletin.android;

import android.app.Dialog;
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
import com.efe.nhhsbulletin.android.ui.main.DatePicker;
import com.efe.nhhsbulletin.android.ui.main.TabList;

public class MainActivity extends AppCompatActivity {

  private static final String TAG = MainActivity.class.getSimpleName();
  private ServerConnection server;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    TabList tabList = new TabList(this, getSupportFragmentManager());
    ViewPager viewPager = findViewById(R.id.view_pager);
    viewPager.setAdapter(tabList);
    TabLayout tabs = findViewById(R.id.tabs);
    tabs.setupWithViewPager(viewPager);
    server = new ServerConnection();
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

  public void createDatePicker(View view) {
    Dialog dialog = new DatePicker(this);
    dialog.show();
  }
}