package com.efe.nhhsbulletin.server;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class CollectEmail implements RequestHandler<Object, String> {
  public static void main(String[] args) throws IOException {
    BulletinManager bulletin = new BulletinManager("daily-bulletin");
    bulletin.parseEmail(new String(Files.readAllBytes(Paths.get("/home/macmv/Downloads/u4hvc8n6m6vk1vtauh67qsnafedcmei1jqm3u081"))));
  }

  @Override
  public String handleRequest(Object input, Context context) {
    if (!(input instanceof LinkedHashMap)) {
      throw new RuntimeException("Expected input of type LinkedHashMap");
    }
    Map inputMap = (Map) input;
    List records = (List) inputMap.get("Records");
    Map record = (Map) records.get(0);
    Map ses = (Map) record.get("ses");
    Map mail = (Map) ses.get("mail");
    String messageId = (String) mail.get("messageId");

    BulletinManager bulletin = new BulletinManager("daily-bulletin");
    bulletin.collectEmail(messageId);
    return null;
  }
}
