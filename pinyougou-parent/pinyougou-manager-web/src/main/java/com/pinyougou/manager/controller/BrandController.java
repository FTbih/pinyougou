package com.pinyougou.manager.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.pojo.TbBrand;
import com.pinyougou.sellergoods.service.BrandService;
import entity.PageResult;
import entity.Result;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/brand")
public class BrandController {
    @Reference
    private BrandService brandService;


    @RequestMapping("/findAll")
    public List<TbBrand> findAll() {
        return brandService.findAll();
    }

//    @RequestMapping("/findByPage")
//    public PageResult findByPage(Integer pageNum, Integer pageSize){
//        PageResult pageResult = brandService.findByPage(pageNum, pageSize);
//        return pageResult;
//    }

    @RequestMapping("/addBrand")
    public Result addBrand(@RequestBody TbBrand tbBrand){
        try {
            brandService.addBrand(tbBrand);
            return new Result(true, "保存成功");
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false, "保存失败");
        }
    }

    @RequestMapping("/findOne")
    public TbBrand findOne(long id){
        TbBrand tbBrand = brandService.findOne(id);
        return tbBrand;
    }

    @RequestMapping("/updateById")
    public Result updateById(@RequestBody TbBrand tbBrand){
        try {
            brandService.updateById(tbBrand);
            return new Result(true, "保存成功");
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false, "保存失败");
        }
    }

    @RequestMapping("/deleteById")
    public Result deleteById(@RequestBody long[] ids){
        try {
            brandService.deleteById(ids);
            return new Result(true, "删除成功");
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false, "删除失败");
        }
    }

    @RequestMapping("/findByPage")
    public PageResult findByPage(Integer pageNum, Integer pageSize, @RequestBody TbBrand tbBrand){
        PageResult pageResult = brandService.findByPageWithCondition(pageNum, pageSize, tbBrand);
        return pageResult;
    }

    @RequestMapping("/selectOptionList")
    public List<Map> selectOptionList(){
        return brandService.selectOptionList();
    }

}
