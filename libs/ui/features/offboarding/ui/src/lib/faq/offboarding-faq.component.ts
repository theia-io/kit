import { Component } from '@angular/core';
import { DividerComponent } from '@kitouch/ui-components';
import { sep } from 'path';

@Component({
  standalone: true,
  selector: 'feat-offboarding-faq',
  templateUrl: './offboarding-faq.component.html',
  imports: [DividerComponent],
})
export class FeatKitOffboardingFaqComponent {
  faqs = [
    {
      question: 'Q: What is a Kitouch Offboarding page?',
      answer:
        "A: It's a single, shareable webpage designed to make employee farewells more positive, organized, and meaningful. It combines a general message, a collaborative Kudo Board for colleagues to leave messages and memories, and an optional farewell note from the departing person. It also serves as abridge for that person to join the company's Alumni Network.",
    },
    {
      question: 'Q: Who can see the content on a Farewell Board?',
      answer:
        'A: Initially, only the Creator (the HR person or manager who set it up) and the colleagues who have been invited to contribute can see the board. The departing employee (Recipient) will only see the board once the Creator shares the final link with them or when the pre-set delivery date arrives.',
    },
    {
      separate: true,
    },
    {
      question: 'Q:How do I start a new Offboarding experience?',
      answer:
        "A:As a registered user, you can initiate a new Offboarding from your dashboard. You'll be prompted to enter the departing employee's name and last day, and you can add a general message and company logo to get started.",
    },
    {
      question: 'How do I invite colleagues to contribute?',
      answer:
        "A: Once you've created the board, you will get a unique, shareable link. You can send this link to the relevant team members and colleagues via email, Slack, or any other communication channel.",
    },
    {
      question: 'Q: Can I moderate the messages left by others?',
      answer:
        'A: Yes. As the Creator of the board, you have full control. You can review all public contributions and have the ability to edit or remove any message to ensure the content is appropriate and positive.',
    },
    {
      question:
        'Q: When does the departing employee receive the Farewell Board?',
      answer:
        'A: You control when the final board is delivered. You can manually change the board\'s status from "Collecting" to "Sent," which makes the link viewable by the recipient.',
    },
    {
      question:
        'Q: What are the links to company review sites (e.g., Glassdoor) for?',
      answer:
        "A: This is an optional feature that allows you to add links inviting the departing employee to leave a review of their experience at the company. It's a good way to gather honest feedback and build your employer brand.",
    },
    {
      separate: true,
    },
    {
      question: 'Do I need a Kitouch account to leave a message?',
      answer:
        'A: No! To make it as easy as possible for everyone to contribute, you can leave a message without creating a full Kitouch account. You may be asked to provide your email so the system can attribute the message correctly.',
    },
    {
      question: 'Q: Can I edit or delete my message after I post it?',
      answer:
        'A: Yes, you have the flexibility to edit or delete your own contributions up until the board is finalized and sent to the recipient.',
    },
  ];
}
