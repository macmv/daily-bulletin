package com.efe.nhhsbulletin.android.ui.main;

import android.content.Context;
import android.support.annotation.Nullable;
import android.support.annotation.StringRes;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;

import com.efe.nhhsbulletin.android.R;
import com.efe.nhhsbulletin.android.ui.main.tab.Bulletin;
import com.efe.nhhsbulletin.android.ui.main.tab.Resources;
import com.efe.nhhsbulletin.android.ui.main.tab.Schedule;
import com.efe.nhhsbulletin.android.ui.main.tab.Sports;

/**
 * A [FragmentPagerAdapter] that returns a fragment corresponding to
 * one of the tabs.
 */
public class TabList extends FragmentPagerAdapter {

  @StringRes
  private static final int[] TAB_TITLES = new int[]{R.string.tab_text_1, R.string.tab_text_2, R.string.tab_text_3, R.string.tab_text_4};
  private final Context mContext;

  public TabList(Context context, FragmentManager fm) {
    super(fm);
    mContext = context;
  }

  @Override
  public Fragment getItem(int position) {
    switch (position) {
      case 0:
        return new Bulletin();
      case 1:
        return new Sports();
      case 2:
        return new Schedule();
      case 3:
        return new Resources();
    }
    return null;
  }

  @Nullable
  @Override
  public CharSequence getPageTitle(int position) {
    return mContext.getResources().getString(TAB_TITLES[position]);
  }

  @Override
  public int getCount() {
    return 4;
  }
}