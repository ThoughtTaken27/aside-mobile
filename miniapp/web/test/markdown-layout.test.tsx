/**
 * Mobile-readable answer hierarchy.
 *
 * Ordinary Markdown stays ordinary. A bullet whose first content is a bold
 * label gets the richer scan pattern from the public app preview: a quiet
 * semantic glyph, a standalone label, and its explanation alongside it.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Markdown } from '../src/components/Markdown';

afterEach(cleanup);

describe('labelled Markdown bullets', () => {
  it('turns a bold-leading bullet into a structured information row', () => {
    render(<Markdown text={'- **Project update:** Shipped the new dashboard.'} />);

    const item = screen.getByRole('listitem');
    expect(item.classList.contains('md-lead-item')).toBe(true);
    expect(item.querySelector('.md-lead-icon')).toBeTruthy();
    expect(item.querySelector('.md-lead-copy strong')?.textContent).toBe(
      'Project update:',
    );
  });

  it('chooses the matching neutral glyph from the explicit label', () => {
    const { container } = render(
      <Markdown
        text={[
          '- **Goals:** Finish the brief.',
          '- **Notes:** Protect the morning block.',
          '- **Schedule:** Start at nine.',
        ].join('\n')}
      />,
    );

    expect(container.querySelector('.lucide-target')).toBeTruthy();
    expect(container.querySelector('.lucide-lightbulb')).toBeTruthy();
    expect(container.querySelector('.lucide-calendar-days')).toBeTruthy();
  });

  it('leaves an ordinary bullet as a native list item', () => {
    render(<Markdown text={'- Review priorities'} />);

    const item = screen.getByRole('listitem');
    expect(item.classList.contains('md-lead-item')).toBe(false);
    expect(item.querySelector('.md-lead-icon')).toBeNull();
  });
});
