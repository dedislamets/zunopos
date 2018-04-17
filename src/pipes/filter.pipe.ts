import { Pipe, PipeTransform } from "@angular/core";
 
@Pipe({
    name: "filter",
    pure: false
})

export class StringFilterPipe implements PipeTransform {
 
    transform(array: any[], filterby: any): any {
        console.log('test');
        return array;
    }
}
