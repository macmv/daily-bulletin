package com.efe.nhhsbulletin.android.connection;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.ClientConfiguration;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSCredentialsProvider;
import com.amazonaws.auth.AWSCredentialsProviderChain;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.auth.DefaultAWSCredentialsProviderChain;
import com.amazonaws.regions.Region;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.services.s3.model.S3ObjectSummary;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class S3Manager {
    public static final String TAG = S3Manager.class.getSimpleName();

    private final String bucketName;
    private final AmazonS3Client s3;

    public S3Manager(String bucketName) {
        this.bucketName = bucketName;
        BasicAWSCredentials creds = new BasicAWSCredentials("AKIA3VUBT6SYOPGQCH6G", "gsjDhICJCVFBm1BPrs8XmTXDBTv/e/6TYu84lGII");
//        BasicAWSCredentials creds = new BasicAWSCredentials("", "");
        s3 = new AmazonS3Client(creds, Region.getRegion(Regions.DEFAULT_REGION));
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

    public List<String> list(String prefix) {
        List<String> files = new ArrayList<>();
        for (S3ObjectSummary obj : s3.listObjects(bucketName, prefix).getObjectSummaries()) {
            files.add(obj.getKey());
        }
        return files;
    }
}
