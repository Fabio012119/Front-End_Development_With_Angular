import { Dish } from '../shared/dish';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';




@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {


dish :Dish;
dishIds:string[];
prev:string;
next:string;

  constructor(private dishService:DishService,
    private route: ActivatedRoute,
    private Location:Location) { }

  ngOnInit() {
    this.dishService.getDishIds().subscribe((dishIds)=>this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params:Params)=>this.dishService.getDish(params['id'])))
    .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
  }


  setPrevNext(dishId: string){
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index -1 )%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index +1 )%this.dishIds.length];
  }

  goBack():void{
    this.Location.back();
  }
}
function subscribe(arg0: (dish: any) => void) {
  throw new Error('Function not implemented.');
}

