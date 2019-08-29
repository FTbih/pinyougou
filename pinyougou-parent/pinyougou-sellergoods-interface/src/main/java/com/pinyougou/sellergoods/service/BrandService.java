package com.pinyougou.sellergoods.service;

import com.pinyougou.pojo.TbBrand;
import entity.PageResult;

import java.util.List;
import java.util.Map;

public interface BrandService {
    public List<TbBrand> findAll();

    public PageResult findByPage(Integer pageNum, Integer pageSize);

    void addBrand(TbBrand tbBrand) throws Exception;

    public TbBrand findOne(long id);

    public void updateById(TbBrand tbBrand) throws Exception;

    public void deleteById(long[] ids) throws  Exception;

    PageResult findByPageWithCondition(Integer pageNum, Integer pageSize, TbBrand tbBrand);

    List<Map> selectOptionList();

}
