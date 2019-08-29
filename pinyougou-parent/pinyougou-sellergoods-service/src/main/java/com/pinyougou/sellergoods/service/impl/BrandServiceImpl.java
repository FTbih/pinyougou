package com.pinyougou.sellergoods.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.pinyougou.mapper.TbBrandMapper;
import com.pinyougou.pojo.TbBrand;
import com.pinyougou.pojo.TbBrandExample;
import com.pinyougou.sellergoods.service.BrandService;
import entity.PageResult;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Map;

@Service
public class BrandServiceImpl implements BrandService {
    @Autowired
    private TbBrandMapper tbBrandMapper;



    @Override
    public List<TbBrand> findAll() {
        return tbBrandMapper.selectByExample(null);
    }

    @Override
    public PageResult findByPage(Integer pageNum, Integer pageSize) {
        //分页相关的东西
        PageHelper.startPage(pageNum, pageSize);
        Page<TbBrand> page = (Page<TbBrand>) tbBrandMapper.selectByExample(null);
        PageResult pageResult = new PageResult();
        pageResult.setTotal(page.getTotal());
        pageResult.setRows(page.getResult());
        return pageResult;
    }

    @Override
    public void addBrand(TbBrand tbBrand) throws Exception{
        tbBrandMapper.insert(tbBrand);
    }

    @Override
    public TbBrand findOne(long id) {
        TbBrand tbBrand = tbBrandMapper.selectByPrimaryKey(id);
        return tbBrand;
    }

    @Override
    public void updateById(TbBrand tbBrand) throws Exception {
        tbBrandMapper.updateByPrimaryKey(tbBrand);
    }

    @Override
    public void deleteById(long[] ids) throws Exception {
        for (int i = 0; i < ids.length; i++) {
            tbBrandMapper.deleteByPrimaryKey(ids[i]);
        }
    }

    @Override
    public PageResult findByPageWithCondition(Integer pageNum, Integer pageSize, TbBrand tbBrand) {
        PageHelper.startPage(pageNum, pageSize);
        TbBrandExample tbBrandExample = new TbBrandExample();
        //??
        TbBrandExample.Criteria criteria = tbBrandExample.createCriteria();
        //包装搜索参数
        if(tbBrand != null){
            if(tbBrand.getName() != null && !"".equals(tbBrand.getName())){
                criteria.andNameLike("%"+tbBrand.getName()+"%");
            }

            if(tbBrand.getFirstChar() != null && !"".equals(tbBrand.getFirstChar())){
                criteria.andFirstCharEqualTo(tbBrand.getFirstChar());
            }
        }

        Page page = (Page)tbBrandMapper.selectByExample(tbBrandExample);
        long total = page.getTotal();
        List result = page.getResult();
        PageResult pageResult = new PageResult();
        pageResult.setTotal(total);
        pageResult.setRows(result);
        return pageResult;
    }

    @Override
    public List<Map> selectOptionList() {
        return tbBrandMapper.selectOptionList();
    }
}
