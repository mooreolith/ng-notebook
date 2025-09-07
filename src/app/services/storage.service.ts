import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class NotebookService {
  store(method: string, title: string, json: string){
    const filename = this.filename(title);

    switch(method){
      case 'localStorage':
        localStorage.setItem('ng-notebook:last-ls', filename);
        localStorage.setItem(filename, json);
        break;

      case 'file':
        const blob = new Blob([json], {type: 'application/vnd.jupyter.notebook+json'});
        const dlURL= window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.setAttribute('style', 'display: none;');
        document.body.appendChild(a);
        a.href = dlURL;
        a.download = filename
        a.click();
        window.URL.revokeObjectURL(dlURL);
        a.remove();
        break;

      case 'url':
        const lastURL = localStorage.getItem('ng-notebook:last-url') ?? '';
        const postURL = prompt('POST URL', lastURL);
        if(!postURL) return;
        localStorage.setItem('ng-notebook:last-url', postURL);

        fetch(postURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/vnd.jupyter.notebook+json',
          },
          body: json
        }).then(response => {
          if(!response.ok){
            alert(`HTTP Error! Status: ${response.status}`)
            throw new Error(`HTTP Error! Status: ${response.status} ${response.statusText}`);
          }
        })
        break;
    }
  }

  async load(method: string, title: string): Promise<string> {
    let json = '';
    const filename = this.filename(title);

    switch(method){
      case 'localStorage':
        json = localStorage.getItem(filename) ?? '';
        break;
      
      case 'file':
        let input: HTMLInputElement;
        json = await new Promise((resolve, reject) => {
          input = document.createElement('input');
          input.type = 'file';
          input.setAttribute('style', 'display: none;');
          document.appendChild(input)
          input.addEventListener('change', (ie) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve(reader.result as string);
              input.remove();
            }
            reader.readAsText((input.files as FileList)[0] as File);
          })
          input.click();
        });
        break;

      case 'url':
        const lastURL = localStorage.getItem('ng-notebook:last-url') ?? '';
        const getURL = prompt("GET URL", lastURL);
        if(!getURL) return '';
        localStorage.setItem('ng-notebook:last-url', getURL);

        const response = await fetch(getURL, {
          method: "GET",
        })
        if(!response.ok){
          alert(`HTTP Error! Status: ${response.status} ${response.statusText}`);
          throw new Error(`HTTP Error! ${response.status} ${response.statusText}`);
        }

        json = await response.text()
        break;
    }

    return json;
  }

  private filename(title: string): string {
    if(!title.endsWith('.ipynb')){
      return `${title}.ipynb`;
    }

    return title;
  }
}