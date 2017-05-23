import {Component, ElementRef} from '@angular/core';
import {ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import {menus} from './sidebar.config';
import 'rxjs/Rx';

@Component({
    selector: 'home-sidebar',
    templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
    menus: any[] = menus;

    constructor(private route: ActivatedRoute, private router: Router, el: ElementRef) {
        this.router.events.subscribe(event => {
            // 判断路由结束
            if (event instanceof NavigationEnd) {
                const $menu = $(el.nativeElement).find('#sidebar-menu');
                this.menus.forEach((menu, index) => {
                    console.log(menu, this.isChildMenuActived(menu))
                    if (this.isChildMenuActived(menu)) {
                        // 将被激活的路由对应的li添加“active”的class
                        $menu.find('li.topper-menu').eq(index).addClass('active');
                    }
                });
                // 初始化菜单状态
                $menu.metisMenu();
            }
        });
    }

    // 判断路由是否激活状态
    isActive(url: string): boolean {
        console.log(url, this.router.isActive(url, true))
        return this.router.isActive(url, false);
    }

    // 判断菜单是否有子路由处于激活状态
    isChildMenuActived(menu: any): boolean {
        let hasOneActive = false;
        if (menu.childMenus) {
            // 遍历子路由看是否被激活
            menu.childMenus.forEach(child => {
                hasOneActive = hasOneActive || this.isActive(child.link);
            });
        }
        return hasOneActive;
    }
}