import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PhotoBoardService } from 'src/app/shared/components/photo-board/services/photo-board.service';
import { buildPhotoList } from 'src/app/shared/components/photo-board/test/build-photo-list';

import { PhotoListComponent } from './photo-list.component';
import { PhotoListModule } from './photo-list.module';

describe(PhotoListComponent.name, () => {
  let component: PhotoListComponent;
  let fixture: ComponentFixture<PhotoListComponent>;
  let service: PhotoBoardService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoListModule, HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoListComponent);
    component = fixture.componentInstance;
    //O Testbed permit que serviço que sejam providos pelos modulos sejam injetados no componente
    // de test
    service = TestBed.inject(PhotoBoardService);
  });

  it('SHOULD create component', () => {
    expect(component).toBeTruthy();
  });

  it('(D) SHOULD display board WHEN data arrives', () => {
    const photos = buildPhotoList();
    // o spyOn irá espiar o service detPhtos e retornará um Observable de uma lista de photos
    // da mesma forma que a API original do service
    //__ A função spyOn recebe como primeiro parâmetro um objeto e como segundo uma string
    //__ que contém exatamente o nome do método que queremos espionar. Em seguida, encadeando
    //__ uma chamada há .and.returnValue, podemos passar para returnValue o valor que o método retornará quando for chamado.
    spyOn(service, 'getPhotos').and.returnValue(of(photos));
    //o detectChanges só pode ser chamado após a modificação do service, pois senão o ciclo de vida do ngOnInit é disparado antes da modificação
    // assim o service irá aguardar uma requisição http ao backend, algo que não é possivel de se fazer no teste
    fixture.detectChanges();
    const board = fixture.nativeElement.querySelector('app-photo-board');
    const loader = fixture.nativeElement.querySelector('.loader');
    //É esperado que o board tenha dados e não seja nulo, caso o boarder tenha dados, o loader será nulo.
    expect(board).withContext('Should display board').not.toBeNull();
    expect(loader).withContext('Should not display loader').toBeNull();
  });

  it('(D) SHOULD display loader WHILE waits for data ', () => {
    const photos = buildPhotoList();
    spyOn(service, 'getPhotos').and.returnValue(of(null));
    fixture.detectChanges();
    const board = fixture.nativeElement.querySelector('app-photo-board');
    const loader = fixture.nativeElement.querySelector('.loader');
    //É esperado que o loader spinner apareça quando não da dados no board.
    expect(board).withContext('Should not display board').toBeNull();
    expect(loader).withContext('Should display loader').not.toBeNull();
  });
});
