// 获取Injectable服务
import { Injectable } from '@angular/core';
// 获取Http服务
import { Http, Response } from '@angular/http';
// 获取Observable服务
import { Observable } from 'rxjs/Observable';
// 获取rxjs相关操作服务（map等）
import '../rxjs-operators';

@Injectable()
export class OtherService {
  // 注入Http服务
  constructor(public http: Http) {}
  // 设置获取数据的地址，这里我们使用本地的json文件模拟
  private dataUrl: string = 'app/info.json';

  // 定义方法，用于获取Observable服务
  getDatas(): Observable<any> {
    // 使用angular的http服务获取数据，默认返回observable
    return this.http.get(this.dataUrl)
      // 使用map方法将数据转换为json
      .map(res => res.json().data)
      // 异常的捕获并进行处理
      .catch(this.handleError);
  }

  // 定义私有方法来处理异常
  private handleError(error: any) {
    // 异常的输出需要尽量详细，对于Bug的定位也很有帮助
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // 输出异常信息
    return Observable.throw(errMsg);
  }
}