import {Component, Prop, h, Host} from '@stencil/core';
import {ITemplate} from '@verdocs/js-sdk';

const ActionsIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>`;

const EmailIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/></svg>`;

const PagesIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4H8c-1.1 0-1.99.9-1.99 2L6 21c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V11l-6-6zM8 21V7h6v5h5v9H8z"/></svg>`;

const StarIcon = `<svg width="31" height="29" viewBox="0 0 31 29" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_31553_1553)"><path d="M30.886 11.4917C30.8916 11.0917 30.753 10.7034 30.4962 10.3993C30.2394 10.0953 29.882 9.8964 29.4908 9.83995L29.5182 9.65005L29.4908 9.83995L21.0938 8.60261L17.3412 0.912551C17.2067 0.638179 16.9992 0.407285 16.7421 0.245866C16.485 0.0844465 16.1885 -0.00111389 15.886 -0.00111389C15.5835 -0.00111389 15.287 0.0844465 15.0299 0.245866C14.7728 0.407285 14.5653 0.638179 14.4308 0.912551L10.6781 8.60261L2.28121 9.8392C1.89206 9.89475 1.53611 10.0916 1.2796 10.3931C1.02308 10.6945 0.88348 11.08 0.886776 11.4779C0.886447 11.6961 0.929977 11.912 1.01472 12.1125C1.09946 12.3131 1.22363 12.4941 1.37968 12.6445L7.45563 18.5744L6.01943 27.0241C6.00289 27.1258 5.99449 27.2287 5.99435 27.3317C5.99313 27.7717 6.16395 28.1943 6.4695 28.5071C6.77505 28.82 7.19045 28.9976 7.62496 29.0013C7.88846 29.0008 8.14779 28.9345 8.37992 28.8083L15.8883 24.8217L23.3967 28.8114C23.6287 28.9361 23.8873 29.0015 24.15 29.002C24.5752 28.9998 24.9832 28.8318 25.2893 28.5329C25.4452 28.3832 25.5695 28.2029 25.6544 28.003C25.7392 27.8031 25.783 27.5878 25.783 27.3702C25.7827 27.2731 25.7743 27.176 25.7579 27.0803L24.3209 18.6296L30.3931 12.7022C30.7094 12.3809 30.8867 11.9454 30.886 11.4917ZM22.0759 17.53L21.9437 17.3916L22.0759 17.53C22.0072 17.5977 21.9525 17.6787 21.9152 17.7681C21.8779 17.8575 21.8587 17.9536 21.8587 18.0506L21.8693 18.1737L23.2037 26.0237L16.2164 22.3148C16.1136 22.2602 15.9994 22.2317 15.8833 22.2317C15.7673 22.2317 15.653 22.2602 15.5503 22.3148L8.57132 26.0245L9.90651 18.1745L9.91712 18.0506C9.91696 17.9536 9.89768 17.8576 9.86038 17.7682C9.82308 17.6788 9.76851 17.5978 9.6999 17.53L4.05538 11.9724L11.8576 10.8258C11.9725 10.8088 12.0816 10.7638 12.1755 10.6947C12.2695 10.6256 12.3454 10.5344 12.3969 10.429L15.886 3.27721L19.3797 10.429C19.4313 10.5344 19.5074 10.6256 19.6014 10.6948C19.6955 10.7639 19.8047 10.8088 19.9197 10.8258L27.7197 11.9747L22.0759 17.53Z" fill="#ADB6BD"/></g><defs><clipPath id="clip0_31553_1553"><rect width="30" height="29" fill="white" transform="translate(0.886719)"/></clipPath></defs></svg>`;

/**
 * Displays a summary of a template
 */
@Component({
  tag: 'verdocs-template-card',
  styleUrl: 'verdocs-template-card.scss',
  shadow: false,
})
export class VerdocsTemplateCard {
  /**
   * The template for which the card will be rendered.
   */
  @Prop() template: ITemplate;

  render() {
    return (
      <Host>
        {/* TODO */}
        {/*<img src={this.template?.documents?.thumbnail_url || ''} alt="Template Thumbnail" class="thumbnail" />*/}

        <span class="name">{this.template.name}</span>
        <span class="org-name">{this.template.organization?.name || 'Public'}</span>

        <hr />

        <div class="controls">
          <div class="control">
            <span class="icon" innerHTML={StarIcon} />
            <span class="value">{this.template.star_counter}</span>
          </div>

          <div class="control secondary">
            <span class="icon" innerHTML={PagesIcon} />
            <span class="value">{this.template?.documents?.[0]?.pages || 1}</span>
          </div>

          <div class="control secondary">
            <span class="icon" innerHTML={EmailIcon} />
            <span class="value">{this.template.counter}</span>
          </div>

          <span class="additional-controls" innerHTML={ActionsIcon} />
        </div>
      </Host>
    );
  }
}
