import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { of,Observable } from 'rxjs';
import { delay } from 'rxjs/operators/';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { map, catchError } from 'rxjs/operators/';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private http: HttpClient, private ProcessHTTPMsgService:ProcessHTTPMsgService) { }

  getPromotions():Observable<Promotion[]> {
    return this.http.get<Promotion[]>(baseURL + 'promotions' )
    .pipe(catchError(this.ProcessHTTPMsgService.handleError));
  }

  getPromotion(id:string): Observable<Promotion>{
    return this.http.get<Promotion>(baseURL + 'promotions/' + id)
    .pipe(catchError(this.ProcessHTTPMsgService.handleError));
  }

  getFeaturedPromotion(): Observable<Promotion> {
    return this.http.get<Promotion>(baseURL + 'promotions?featured=true')
    .pipe(map(promotions=>promotions[0]))
    .pipe(catchError(this.ProcessHTTPMsgService.handleError));
  }
  getPromotionsIds():Observable<string[] | any> {
    return this.getPromotions().pipe(map(promotions => promotions.map(promotion =>promotion.id)))
    .pipe(catchError(error=>error));
  }

  putPromotion(promotion:Promotion): Observable<Promotion> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };
    return this.http.put<Promotion>(baseURL + 'promotions/' + promotion.id,promotion,httpOptions)
    .pipe(catchError(this.ProcessHTTPMsgService.handleError));
  }
}
