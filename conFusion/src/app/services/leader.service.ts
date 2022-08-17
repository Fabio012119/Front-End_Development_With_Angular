import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { of,Observable } from 'rxjs';
import { delay } from 'rxjs/operators/';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { map, catchError } from 'rxjs/operators/';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private http: HttpClient, private ProcessHTTPMsgService:ProcessHTTPMsgService) { }

  getLeaders():Observable<Leader[]> {
    return this.http.get<Leader[]>(baseURL + 'leaders' )
    .pipe(catchError(this.ProcessHTTPMsgService.handleError));
  }
  getLeader(id:string): Observable<Leader>{
    return this.http.get<Leader>(baseURL + 'leaders/' + id)
    .pipe(catchError(this.ProcessHTTPMsgService.handleError));
}
  getFeaturedLeader(): Observable<Leader> {
    return this.http.get<Leader>(baseURL + 'leaders?featured=true')
    .pipe(map(leaders=>leaders[0]))
    .pipe(catchError(this.ProcessHTTPMsgService.handleError));
  }
  getLeaderIds():Observable<string[] | any> {
    return this.getLeaders().pipe(map(leaders => leaders.map(leader =>leader.id)))
    .pipe(catchError(error=>error));
  }

  putLeader(leader:Leader): Observable<Leader> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };
    return this.http.put<Leader>(baseURL + 'leaders/' + leader.id,leader,httpOptions)
    .pipe(catchError(this.ProcessHTTPMsgService.handleError));
  }
}
