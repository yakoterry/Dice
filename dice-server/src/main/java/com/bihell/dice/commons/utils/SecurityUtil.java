package com.bihell.dice.commons.utils;

import com.bihell.dice.commons.vo.RoleInfoVO;
import com.bihell.dice.commons.model.SysUserModel;
import com.bihell.dice.commons.model.UserModel;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;
import java.util.Set;

/**
 * Spring Security 工具类
 *
 * @author Tang
 */
public class SecurityUtil {

    private SecurityUtil() {
    }

    /**
     * 管理员标识
     */
    public static final String ADMIN_ROLE_KEY = "admin";

    /**
     * 所有权限
     */
    public static final String ALL_PERMISSIONS = "*:*:*";

    /**
     * 获取登陆用户信息
     *
     * @return 登陆用户信息
     */
    public static UserModel getUserModel() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(principal instanceof UserModel){
            return (UserModel) principal;
        }
        else {
            //modify by terry 20250104
            //非正常登录(TOC端)验证用户如何处理待定，先不报错
            SysUserModel sysUserModel = new SysUserModel();
            sysUserModel.setUsername((String) principal);
            UserModel userModel = new UserModel();
            userModel.setUser(sysUserModel);
            return userModel;
        }
    }

    /**
     * 获取用户信息
     *
     * @return 用户信息
     */
    public static SysUserModel getUser() {
        return getUserModel().getUser();
    }

    /**
     * 获取角色信息
     *
     * @return 角色信息
     */
    public static List<RoleInfoVO> getRoles() {
        return getUserModel().getRoles();
    }

    /**
     * 获取权限信息
     *
     * @return 权限信息
     */
    public static Set<String> getPermissions() {
        return getUserModel().getPermissions();
    }

    /**
     * 判断是否为管理员
     *
     * @return 结果
     */
    public static boolean isAdmin() {
        return getRoles().contains(ADMIN_ROLE_KEY) && getPermissions().contains(ALL_PERMISSIONS);
    }

    /**
     * BCryptPasswordEncoder 生成密文密码
     *
     * @param rawPassword 明文密码
     * @return 密文密码
     */
    public static String encryptPassword(String rawPassword) {
        var passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.encode(rawPassword);
    }

    /**
     * 验证明文密码是否与密文密码匹配
     *
     * @param rawPassword     明文密码
     * @param encodedPassword 密文密码
     * @return 结果
     */
    public static boolean matchesPassword(String rawPassword, String encodedPassword) {
        var passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

}
