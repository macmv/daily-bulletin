package com.efe.nhhsbulletin.server;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class S3Manager {
  private static final AmazonS3 s3;

  static {
    s3 = AmazonS3ClientBuilder.standard().withRegion(Regions.DEFAULT_REGION).build();
  }

  private final String bucketName;

  public S3Manager(String bucketName) {
    this.bucketName = bucketName;
  }

  public String read(String keyName) {
    try {
      S3Object obj = s3.getObject(new GetObjectRequest(bucketName, keyName));
      S3ObjectInputStream is = obj.getObjectContent();
      BufferedReader buf = new BufferedReader(new InputStreamReader(is));
      StringBuilder sb = new StringBuilder();
      String line;
      while ((line = buf.readLine()) != null) {
        sb.append(line).append("\n");
      }
      return sb.toString();
    } catch (AmazonServiceException | IOException e) {
      e.printStackTrace(System.err);
      System.exit(1);
      return null;
    }
  }

  public void write(String keyName, InputStream data) {
    try {
      s3.putObject(new PutObjectRequest(bucketName, keyName, data, null)
              .withCannedAcl(CannedAccessControlList.PublicRead));
    } catch (AmazonServiceException e) {
      e.printStackTrace(System.err);
      System.exit(1);
    }
  }

  public boolean exists(String keyName) {
    try {
      return s3.doesObjectExist(bucketName, keyName);
    } catch (AmazonServiceException e) {
      e.printStackTrace(System.err);
      System.exit(1);
      return false;
    }
  }

//  public ArrayList<String> list(String prefix) {
//    s3.listObjects(bucketName, prefix)
//  }
}
