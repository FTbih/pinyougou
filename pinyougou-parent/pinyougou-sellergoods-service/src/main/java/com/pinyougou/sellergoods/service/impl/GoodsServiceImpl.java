package com.pinyougou.sellergoods.service.impl;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.alibaba.fastjson.JSON;
import com.pinyougou.grouppojo.Goods;
import com.pinyougou.mapper.*;
import com.pinyougou.pojo.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.alibaba.dubbo.config.annotation.Service;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.pinyougou.pojo.TbGoodsExample.Criteria;
import com.pinyougou.sellergoods.service.GoodsService;

import entity.PageResult;

import static com.alibaba.fastjson.JSON.parseObject;

/**
 * 服务实现层
 * @author Administrator
 *
 */
@Service
public class GoodsServiceImpl implements GoodsService {

	@Autowired
	private TbGoodsMapper goodsMapper;

	@Autowired
	private TbGoodsDescMapper goodsDescMapper;

	@Autowired
	private TbItemMapper itemMapper;

	@Autowired
	private TbBrandMapper brandMapper;

	@Autowired
	private TbSellerMapper sellerMapper;

	@Autowired
	private TbItemCatMapper itemCatMapper;
	
	/**
	 * 查询全部
	 */
	@Override
	public List<TbGoods> findAll() {
		return goodsMapper.selectByExample(null);
	}

	/**
	 * 按分页查询
	 */
	@Override
	public PageResult findPage(int pageNum, int pageSize) {
		PageHelper.startPage(pageNum, pageSize);		
		Page<TbGoods> page=   (Page<TbGoods>) goodsMapper.selectByExample(null);
		return new PageResult(page.getTotal(), page.getResult());
	}

	/**
	 * 增加
	 */
	@Override
	public void add(Goods goods) {
		TbGoods tbGoods = goods.getGoods();
		tbGoods.setAuditStatus("0");
		goodsMapper.insert(tbGoods);
		TbGoodsDesc goodsDesc = goods.getGoodsDesc();
		goodsDesc.setGoodsId(tbGoods.getId());
		goodsDescMapper.insert(goodsDesc);

		//获取item表格中的数据

		if("1".equals(goods.getGoods().getIsEnableSpec())) {
			List<TbItem> itemList = goods.getItemList();
			//遍历数据进行存储
			for (TbItem tbItem : itemList) {
				//存储title(商品名称加spec)
				//获取商品名称
				String goodsName = goods.getGoods().getGoodsName();
				//获取spec集合
				Map<String, Object> map = JSON.parseObject(tbItem.getSpec());
				Set<String> keys = map.keySet();
				String specName = "";
				for (String key : keys) {
					String value = (String) map.get(key);
					specName += value + " ";
				}
				//拼接
				String title = goodsName + " " + specName;
				//得到title
				tbItem.setTitle(title);

				//categoryId
				tbItem.setCategoryid(goods.getGoods().getCategory3Id());

				//createTime
				tbItem.setCreateTime(new Date());
				//updateTime
				tbItem.setUpdateTime(new Date());

				//goodsId
				tbItem.setGoodsId(goods.getGoods().getId());

				//sellerId
				tbItem.setSellerId(goods.getGoods().getSellerId());

				//brand
				TbBrand tbBrand = brandMapper.selectByPrimaryKey(goods.getGoods().getBrandId());
				tbItem.setBrand(tbBrand.getName());

				//seller
				TbSeller tbSeller = sellerMapper.selectByPrimaryKey(goods.getGoods().getSellerId());
				tbItem.setSeller(tbSeller.getNickName());

				//图片
				List<Map> maps = JSON.parseArray(goods.getGoodsDesc().getItemImages(), Map.class);
				tbItem.setImage((String) maps.get(0).get("url"));

				//插入数据
				itemMapper.insert(tbItem);
			}
		}else{
			TbItem item=new TbItem();
			item.setTitle(goods.getGoods().getGoodsName());//商品KPU+规格描述串作为SKU名称
			item.setPrice( goods.getGoods().getPrice() );//价格
			item.setStatus("1");//状态
			item.setIsDefault("1");//是否默认
			item.setNum(99999);//库存数量
			item.setSpec("{}");
			setItemValus(goods,item);
			itemMapper.insert(item);

		}
	}

	private void setItemValus(Goods goods,TbItem item) {
		item.setGoodsId(goods.getGoods().getId());//商品SPU编号
		item.setSellerId(goods.getGoods().getSellerId());//商家编号
		item.setCategoryid(goods.getGoods().getCategory3Id());//商品分类编号（3级）
		item.setCreateTime(new Date());//创建日期
		item.setUpdateTime(new Date());//修改日期

		//品牌名称
		TbBrand brand = brandMapper.selectByPrimaryKey(goods.getGoods().getBrandId());
		item.setBrand(brand.getName());
		//分类名称
		TbItemCat itemCat = itemCatMapper.selectByPrimaryKey(goods.getGoods().getCategory3Id());
		item.setCategory(itemCat.getName());

		//商家名称
		TbSeller seller = sellerMapper.selectByPrimaryKey(goods.getGoods().getSellerId());
		item.setSeller(seller.getNickName());

		//图片地址（取spu的第一个图片）
		List<Map> imageList = JSON.parseArray(goods.getGoodsDesc().getItemImages(), Map.class) ;
		if(imageList.size()>0){
			item.setImage ( (String)imageList.get(0).get("url"));
		}
	}



	/**
	 * 修改
	 */
	@Override
	public void update(Goods goods){
		goods.getGoods().setAuditStatus("0");
		//update goods表
		goodsMapper.updateByPrimaryKey(goods.getGoods());
		//update goodsDesc table
		goodsDescMapper.updateByPrimaryKey(goods.getGoodsDesc());

		//update item table
		//先删除原表数据，根据goodsId删
		itemMapper.deleteByPrimaryKey(goods.getGoods().getId());

		//插入新数据
		if("1".equals(goods.getGoods().getIsEnableSpec())) {
			List<TbItem> itemList = goods.getItemList();
			//遍历数据进行存储
			for (TbItem tbItem : itemList) {
				//存储title(商品名称加spec)
				//获取商品名称
				String goodsName = goods.getGoods().getGoodsName();
				//获取spec集合
				Map<String, Object> map = JSON.parseObject(tbItem.getSpec());
				Set<String> keys = map.keySet();
				String specName = "";
				for (String key : keys) {
					String value = (String) map.get(key);
					specName += value + " ";
				}
				//拼接
				String title = goodsName + " " + specName;
				//得到title
				tbItem.setTitle(title);

				//categoryId
				tbItem.setCategoryid(goods.getGoods().getCategory3Id());

				//createTime
				tbItem.setCreateTime(new Date());
				//updateTime
				tbItem.setUpdateTime(new Date());

				//goodsId
				tbItem.setGoodsId(goods.getGoods().getId());

				//sellerId
				tbItem.setSellerId(goods.getGoods().getSellerId());

				//brand
				TbBrand tbBrand = brandMapper.selectByPrimaryKey(goods.getGoods().getBrandId());
				tbItem.setBrand(tbBrand.getName());

				//seller
				TbSeller tbSeller = sellerMapper.selectByPrimaryKey(goods.getGoods().getSellerId());
				tbItem.setSeller(tbSeller.getNickName());

				//图片
				List<Map> maps = JSON.parseArray(goods.getGoodsDesc().getItemImages(), Map.class);
				tbItem.setImage((String) maps.get(0).get("url"));

				//插入数据
				itemMapper.updateByPrimaryKey(tbItem);
			}
		}else{
			TbItem item=new TbItem();
			item.setTitle(goods.getGoods().getGoodsName());//商品KPU+规格描述串作为SKU名称
			item.setPrice( goods.getGoods().getPrice() );//价格
			item.setStatus("1");//状态
			item.setIsDefault("1");//是否默认
			item.setNum(99999);//库存数量
			item.setSpec("{}");
			setItemValus(goods,item);
			itemMapper.updateByPrimaryKey(item);

		}

	}

	
	/**
	 * 根据ID获取实体
	 * @param id
	 * @return
	 */
	@Override
	public Goods findOne(Long id){
		Goods goods = new Goods();
		//查询goods表
		TbGoods tbGoods = goodsMapper.selectByPrimaryKey(id);
		goods.setGoods(tbGoods);
		//查询goodsDesc表
		TbGoodsDesc tbGoodsDesc = goodsDescMapper.selectByPrimaryKey(id);
		goods.setGoodsDesc(tbGoodsDesc);
		//查询item表
		TbItemExample example = new TbItemExample();
		TbItemExample.Criteria criteria = example.createCriteria();
		criteria.andGoodsIdEqualTo(tbGoods.getId());
		List<TbItem> tbItems = itemMapper.selectByExample(example);
		goods.setItemList(tbItems);

		return goods;
	}

	/**
	 * 批量删除
	 */
	@Override
	public void delete(Long[] ids) {
		for(Long id:ids){
			goodsMapper.deleteByPrimaryKey(id);
		}		
	}
	
	
		@Override
	public PageResult findPage(TbGoods goods, int pageNum, int pageSize) {
		PageHelper.startPage(pageNum, pageSize);
		
		TbGoodsExample example=new TbGoodsExample();
		Criteria criteria = example.createCriteria();
		
		if(goods!=null){			
            if(goods.getSellerId()!=null && goods.getSellerId().length()>0){
//				criteria.andSellerIdLike("%"+goods.getSellerId()+"%");
				criteria.andSellerIdEqualTo(goods.getSellerId());
			}
			if(goods.getGoodsName()!=null && goods.getGoodsName().length()>0){
				criteria.andGoodsNameLike("%"+goods.getGoodsName()+"%");
			}
			if(goods.getAuditStatus()!=null && goods.getAuditStatus().length()>0){
				criteria.andAuditStatusLike("%"+goods.getAuditStatus()+"%");
			}
			if(goods.getIsMarketable()!=null && goods.getIsMarketable().length()>0){
				criteria.andIsMarketableLike("%"+goods.getIsMarketable()+"%");
			}
			if(goods.getCaption()!=null && goods.getCaption().length()>0){
				criteria.andCaptionLike("%"+goods.getCaption()+"%");
			}
			if(goods.getSmallPic()!=null && goods.getSmallPic().length()>0){
				criteria.andSmallPicLike("%"+goods.getSmallPic()+"%");
			}
			if(goods.getIsEnableSpec()!=null && goods.getIsEnableSpec().length()>0){
				criteria.andIsEnableSpecLike("%"+goods.getIsEnableSpec()+"%");
			}
			if(goods.getIsDelete()!=null && goods.getIsDelete().length()>0){
				criteria.andIsDeleteLike("%"+goods.getIsDelete()+"%");
			}
	
		}
		
		Page<TbGoods> page= (Page<TbGoods>)goodsMapper.selectByExample(example);		
		return new PageResult(page.getTotal(), page.getResult());
	}
	
}
