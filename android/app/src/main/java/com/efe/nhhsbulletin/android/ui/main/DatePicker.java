package com.efe.nhhsbulletin.android.ui.main;

import android.app.Dialog;
import android.content.Context;
import android.support.annotation.NonNull;
import android.view.View;
import android.widget.Button;
import android.widget.GridLayout;
import android.widget.TextView;

import com.efe.nhhsbulletin.android.MainActivity;
import com.efe.nhhsbulletin.android.R;

public class DatePicker extends Dialog {

  private static final String TAG = DatePicker.class.getSimpleName();

  public DatePicker(@NonNull Context context) {
    super(context);
    setContentView(R.layout.dialog_date_picker);
    GridLayout grid = findViewById(R.id.buttonGrid);
    for (int i = 0; i < 7; i++) {
      TextView text = new TextView(context);
      text.setClickable(true);
      text.setText("" + i);
      grid.addView(text);
    }
  }
}