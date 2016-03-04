import test from 'ava';
import {hello, me} from '../server/commands/general';

test('/hello', t => {
  t.plan(1);

  const context = {
    sendReply(text) {
      t.is(text, 'Hello Phil! You put world.');
    }
  };

  const target = 'world';
  const user = {name: 'Phil'};

  hello.call(context, target, {}, user);
});

test('/me', t => {
  t.plan(1);

  const room = {
    addHtml(html) {
      const dot = '<strong style=\'color: #8B8637\'>•</strong>';
      t.is(html, `${dot} Phil <em>dances around in a circle.</em>`);
    }
  };

  const user = {name: 'Phil'};

  me('dances around in a circle.', room, user);
});
