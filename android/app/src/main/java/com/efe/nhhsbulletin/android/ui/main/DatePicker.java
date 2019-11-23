package com.efe.nhhsbulletin.android.ui.main;

import android.app.Dialog;
import android.content.Context;
import android.support.annotation.NonNull;

import com.efe.nhhsbulletin.android.MainActivity;
import com.efe.nhhsbulletin.android.R;

public class DatePicker extends Dialog {

  private static final String TAG = MainActivity.class.getSimpleName();

  public DatePicker(@NonNull Context context) {
    super(context);
    setContentView(R.layout.dialog_date_picker);
  }
}