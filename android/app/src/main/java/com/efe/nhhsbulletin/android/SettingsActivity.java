package com.efe.nhhsbulletin.android;

import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.design.widget.FloatingActionButton;
import android.support.v7.app.AppCompatActivity;
import android.view.View;

public class SettingsActivity extends AppCompatActivity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.settings);
    }

    //go back to main activity when floating action button is pressed
    public void Back(View v) {
        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
    }
}
