import { Component, signal, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-editors',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    MatDividerModule,
  ],
  templateUrl: './editors.component.html',
  styleUrl: './editors.component.scss',
})
export class EditorsComponent {
  basicText = signal('');
  richText = signal('<p>Welcome to the <strong>rich text editor</strong>!</p>');
  codeText = signal('function hello() {\n  console.log("Hello World!");\n}');
  markdownText = signal(
    '# Markdown Editor\n\n**Bold text** and *italic text*\n\n- List item 1\n- List item 2',
  );

  selectedLanguage = signal('javascript');

  languages = signal([
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
  ]);

  private fb = inject(FormBuilder);

  editorForm = this.fb.group({
    title: ['Sample Document'],
    content: ['Enter your content here...'],
    language: ['javascript'],
  });

  formatText(command: string, value?: string): void {
    document.execCommand(command, false, value);
  }

  insertLink(): void {
    const url = prompt('Enter URL:');
    if (url) {
      this.formatText('createLink', url);
    }
  }

  insertImage(): void {
    const url = prompt('Enter image URL:');
    if (url) {
      this.formatText('insertImage', url);
    }
  }

  saveContent(): void {
    console.log('Saving content:', {
      basic: this.basicText(),
      rich: this.richText(),
      code: this.codeText(),
      markdown: this.markdownText(),
    });
  }

  exportContent(format: string): void {
    const content = this.richText();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document.${format}`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  onLanguageChange(): void {
    console.log('Language changed to:', this.selectedLanguage());
  }

  onRichTextInput(event: Event): void {
    const target = event.target as HTMLElement;
    this.richText.set(target.innerHTML);
  }
}
