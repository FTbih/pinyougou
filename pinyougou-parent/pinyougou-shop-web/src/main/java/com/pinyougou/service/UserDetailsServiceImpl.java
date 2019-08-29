package com.pinyougou.service;

import com.pinyougou.pojo.TbSeller;
import com.pinyougou.sellergoods.service.SellerService;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.ArrayList;
import java.util.List;

//实现了UserDetailsService（springscurity提供）
//本类用来
public class UserDetailsServiceImpl implements UserDetailsService {

    //获取远程的SellerService
    private SellerService sellerService;
    //因为不能使用reference注解？？好像是包名路径没办法保持一致
    //所以需要给本类中的SellerService用set方法注入对象
    public void setSellerService(SellerService sellerService) {
        this.sellerService = sellerService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        List<GrantedAuthority> grantedAuthorityList = new ArrayList<GrantedAuthority>();
        grantedAuthorityList.add(new SimpleGrantedAuthority("ROLE_SELLER"));

        //通过username去后台查询
        TbSeller tbSeller = sellerService.findOne(username);
        //判断用户是否存在
        if(tbSeller!=null){
            //判断用户状态
            if(tbSeller.getStatus().equals("0")){
                return null;
            }else {
                return new User(tbSeller.getName(), tbSeller.getPassword(), grantedAuthorityList);
            }
        }
        //User的参数（前台传递的username， 数据库中的密码， 用户所具有的角色）
        //username前台传递
        //密码
        //角色
        return null;
    }
}
