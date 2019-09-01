package com.pinyougou.manager.controller;

import com.pinyougou.utils.FastDFSClient;
import entity.Result;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class UploadController {

    @Value("${FILE_SERVER_URL}")
    private String file_server_name;

    @RequestMapping("/myUpload")
    public Result myUpload(MultipartFile file){

        //获取文件后缀名
        String originalFilename = file.getOriginalFilename();
        //
        String extName = originalFilename.substring(originalFilename.lastIndexOf(".") + 1);

        try {
            //通过配置文件创建fastdfs对象
            FastDFSClient fastDFSClient = new FastDFSClient("classpath:config/fdfs_client.conf");
            //上传文件
            String s = fastDFSClient.uploadFile(file.getBytes(), extName);
            //拼接全文件名(http://192.168.25.133/ + s)
            String fileName = file_server_name + s;

            return new Result(true, fileName);
        } catch (Exception e) {
            return new Result(false, "上传失败");
        }

    }
}
