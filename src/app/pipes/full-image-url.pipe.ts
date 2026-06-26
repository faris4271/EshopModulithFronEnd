import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment.development';


@Pipe({
  name: 'fullImageUrl',
  standalone: true,
})
export class FullImageUrlPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value || value.startsWith('http') || value.startsWith('data:')) {
      return value ?? '';
    }
    const combined = `${(environment as any).PhotoBaseUrl}${value}`;
    return combined.replace(/([^:]\/\/)+/g, '$1');
  }
}
