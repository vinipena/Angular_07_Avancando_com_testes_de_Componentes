import { PhotoFrameModule } from './photo-frame.module';
import { CommonModule } from '@angular/common';
import { LikeWidgetModule } from './../like-widget/like-widget.module';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { PhotoFrameComponent } from './photo-frame.component';
import { findIndex } from 'rxjs/operators';

describe(PhotoFrameComponent.name, () => {
  let fixture: ComponentFixture<PhotoFrameComponent> = null;
  let component: PhotoFrameComponent = null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoFrameModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoFrameComponent);
    component = fixture.componentInstance;
  });

  it('SHOULD crate component', () => {
    expect(component).toBeTruthy();
  });

  it(`#${PhotoFrameComponent.prototype.like.name}
  SHOULD trigger (@Output liked) once
  WHEN called multiple times within debounce time`, fakeAsync(() => {
    /*Quando se é necessario testar um metodo que precisa esperar um tempo
    usamos a função fakeAsync e a função tick. No caso do teste, se não as chamarmos
    o sistema chamas as duas funções like um em seguida da outra, não dando tempo da
    lógica de debounce ocorer, assim o expect não detecta nenhuma das ocorrencias. A função tick, faz
    com que o teste aguarde 500ms para o debounce e após isso ele ocorre.*/
    fixture.detectChanges();
    let times = 0;
    component.liked.subscribe(() => times++);
    component.like();
    component.like();
    tick(500);
    expect(times).toBe(1);
  }));

  it(`#${PhotoFrameComponent.prototype.like.name}
  SHOULD trigger (@Output liked) two times
  WHEN called outside debounce time`, fakeAsync(() => {
    fixture.detectChanges();
    let times = 0;
    component.liked.subscribe(() => times++);
    component.like();
    tick(500);
    component.like();
    tick(500);
    expect(times).toBe(2);
  }));
  it(`(D) SHOULD display the number of likes
    WHEN (@Input() likes) is incremented`, () => {
    fixture.detectChanges();
    component.likes++;
    fixture.detectChanges();
    // o fixture consegue referenciar o elemento do DOM referente a instancia do componente o qual ele
    // foi referenciado, dessa forma, chamando o elemento nativo do DOM podemos assegurar teste na interface
    // e de acessebilidade
    const element: HTMLElement =
      fixture.nativeElement.querySelector('.like-counter');
    expect(element.textContent.trim()).toBe('1');
  });
  it('(D) SHOULD update aria-label WHEN (@Input() likes) is incremented', () => {
    fixture.detectChanges();
    component.likes++;
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(element.getAttribute('aria-label')).toBe('1: people liked');
  });
  it('(D) SHOULD have aria-label with a default value of 0 (@Input() likes) ', () => {
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(element.getAttribute('aria-label')).toBe('0: people liked');
  });
  it('(D) SHOULD display image with a src and description WHEN bound to properties', () => {
    const description = 'some description';
    const src = 'http://somesite.com.br/img.jpg';
    component.src = src;
    component.description = description;
    fixture.detectChanges();
    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(img.getAttribute('src')).toBe(src);
    expect(img.getAttribute('alt')).toBe(description);
  });
});
