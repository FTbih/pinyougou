package com.pinyougou.content.service.impl;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import com.alibaba.dubbo.config.annotation.Service;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.pinyougou.mapper.TbContentMapper;
import com.pinyougou.pojo.TbContent;
import com.pinyougou.pojo.TbContentExample;
import com.pinyougou.pojo.TbContentExample.Criteria;
import com.pinyougou.content.service.ContentService;

import entity.PageResult;
import org.springframework.data.redis.core.BoundHashOperations;
import org.springframework.data.redis.core.RedisTemplate;

/**
 * 服务实现层
 * @author Administrator
 *
 */
@Service
public class ContentServiceImpl implements ContentService {

	@Autowired
	private TbContentMapper contentMapper;

	@Autowired
	private RedisTemplate redisTemplate;
	
	/**
	 * 查询全部
	 */
	@Override
	public List<TbContent> findAll() {
		return contentMapper.selectByExample(null);
	}

	/**
	 * 按分页查询
	 */
	@Override
	public PageResult findPage(int pageNum, int pageSize) {
		PageHelper.startPage(pageNum, pageSize);		
		Page<TbContent> page=   (Page<TbContent>) contentMapper.selectByExample(null);
		return new PageResult(page.getTotal(), page.getResult());
	}

	/**
	 * 增加
	 */
	@Override
	public void add(TbContent content) {
		//先清除缓存中的数据
		redisTemplate.boundHashOps("contents").delete(content.getCategoryId());
		//再进行添加广告的操作，这样页面下一次访问时缓存中没有数据，会重新在数据库中查询数据
		contentMapper.insert(content);		
	}

	
	/**
	 * 修改
	 */
	@Override
	public void update(TbContent content){
		//有可能出现修改类别的情况，这样就涉及到两个类别的广告都发生了变化，其中一个类别新增了一条数据，另一个少了一条数据
		//所以两种类别的数据缓存都需要重新查询
		//先将修改前的广告类别数据缓存清除
		redisTemplate.boundHashOps("contents").delete(contentMapper.selectByPrimaryKey(content.getId()).getCategoryId());
		//再将修改后的广告数据缓存清除
		redisTemplate.boundHashOps("contents").delete(content.getCategoryId());
		//最后再进行修改
		contentMapper.updateByPrimaryKey(content);
	}	
	
	/**
	 * 根据ID获取实体
	 * @param id
	 * @return
	 */
	@Override
	public TbContent findOne(Long id){
		return contentMapper.selectByPrimaryKey(id);
	}

	/**
	 * 批量删除
	 */
	@Override
	public void delete(Long[] ids) {
		//id是广告的类别，也是缓存中广告数据的key
		for(Long id:ids){
			//通过id查询出要删除的广告数据
			TbContent tbContent = contentMapper.selectByPrimaryKey(id);
			//通过tbcontent的类别id来清除缓存中对应的广告数据，（说明这一类别ID的广告数据发生改变，需要重新从数据库查询）
			redisTemplate.boundHashOps("contents").delete(tbContent.getCategoryId());
			//删除数据库中的数据
			contentMapper.deleteByPrimaryKey(id);
		}		
	}
	
	
		@Override
	public PageResult findPage(TbContent content, int pageNum, int pageSize) {
		PageHelper.startPage(pageNum, pageSize);
		
		TbContentExample example=new TbContentExample();
		Criteria criteria = example.createCriteria();
		
		if(content!=null){			
						if(content.getTitle()!=null && content.getTitle().length()>0){
				criteria.andTitleLike("%"+content.getTitle()+"%");
			}
			if(content.getUrl()!=null && content.getUrl().length()>0){
				criteria.andUrlLike("%"+content.getUrl()+"%");
			}
			if(content.getPic()!=null && content.getPic().length()>0){
				criteria.andPicLike("%"+content.getPic()+"%");
			}
			if(content.getStatus()!=null && content.getStatus().length()>0){
				criteria.andStatusLike("%"+content.getStatus()+"%");
			}
	
		}
		
		Page<TbContent> page= (Page<TbContent>)contentMapper.selectByExample(example);		
		return new PageResult(page.getTotal(), page.getResult());
	}

	//根据广告分类查询广告
	public List<TbContent> findByCategoryId(Long id){

		List<TbContent> contents = (List<TbContent>)redisTemplate.boundHashOps("contents").get(id);
		if(contents == null){
			System.out.println("数据库数据");
			TbContentExample example = new TbContentExample();
			Criteria criteria = example.createCriteria();
			criteria.andCategoryIdEqualTo(id);
			criteria.andStatusEqualTo("1");
			//排序
			example.setOrderByClause("sort_order");
			contents = contentMapper.selectByExample(example);
			redisTemplate.boundHashOps("contents").put(id, contents);
		}else{
			System.out.println("缓存数据");
		}


		return contents;
	}
	
}
