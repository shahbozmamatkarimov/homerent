import { Component, AfterViewInit } from '@angular/core';

declare var ymaps: any;

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.html',
  styleUrls: ['./map.css']
})

export class Map implements AfterViewInit {

  async ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      await this.loadYandexScript();  // script yuklanishini kutamiz
      this.initMap();                 // keyin xaritani ochamiz
    }
  }

  loadYandexScript(): Promise<void> {
    return new Promise((resolve, reject) => {

      // Agar script oldin yuklangan bo‘lsa — qayta yuklamaymiz
      if (document.getElementById('yandex-map-script')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'yandex-map-script';
      script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
      script.async = true;

      script.onload = () => resolve();
      script.onerror = () => reject("Yandex script load error");

      document.body.appendChild(script);
    });
  }

  initMap() {
    ymaps.ready(() => {
      const map = new ymaps.Map('map', {
        center: [41.311081, 69.240562],
        zoom: 12,
      });

      const coords = [
        [
          [41.315, 69.25],
          [41.32, 69.23],
          [41.305, 69.20],
          [41.30, 69.22],
        ]
      ];

      const polygon = new ymaps.Polygon(
        coords,
        {},
        {
          fillColor: 'rgba(255,0,0,0.3)',
          strokeColor: '#ff0000',
          strokeWidth: 3,
        }
      );

      map.geoObjects.add(polygon);
    });
  }
}
