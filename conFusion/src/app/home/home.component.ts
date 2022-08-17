import { Component, OnInit,Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { flyInOut,expand } from '../animations/app.animations';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[@flyInOut]':'true',
    'style':'display: block'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class HomeComponent implements OnInit {

  dish: Dish;
  dishErrMess:string;
  promoErrMess:string;
  leaderErrMess:string;
  promotion:Promotion;
  leader:Leader;

  constructor(private dishService: DishService,
    private promotionService:PromotionService,
    private leaderService:LeaderService,
    @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
    this.dishService.getFeaturedDish()
    .subscribe(dish=>this.dish = dish,
      errmess => this.dishErrMess=<any>errmess );
    this.promotionService.getFeaturedPromotion()
    .subscribe(promotion=>this.promotion = promotion,
      errmess=>this.promoErrMess=<any>errmess);
    this.leaderService.getFeaturedLeader()
    .subscribe(leader =>  this.leader = leader,
      errmess=>this.leaderErrMess=<any>errmess);
  }
}
