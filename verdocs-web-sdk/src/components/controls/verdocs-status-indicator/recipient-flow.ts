import {SVG} from '@svgdotjs/svg.js';

// Source: workflow-svg.js project. Adapted to not be an external requirement to make it easier for the builder to work.
export function RecipientFlow() {
  let _json = {entities: []} as Record<string, any>;
  let _draw;
  let _lines = [];

  function initalize(id, width, height) {
    _draw = SVG().addTo(id).size(width, height);

    _draw.entities = [];
    _draw.lines = _draw.group();
    _draw.labels = _draw.group();
  }

  function _renderEntities(_draw, entity) {
    const group = _draw.group().attr({id: entity.id});
    _draw.entities.push(group);

    //assginment and default values for entities
    entity.background_color = entity.background_color ? entity.background_color : '#f06';
    entity.color = entity.color ? entity.color : '#ffffff';
    entity.radius = entity.radius ? entity.radius : 0;

    //the real entity
    group.entity = group
      .rect(entity.width, entity.height)
      .cx(entity.width / 2)
      .cy(entity.height / 2)
      .attr({fill: '#ffffff', stroke: entity.color, ['stroke-width']: 2})
      .radius(entity.radius);

    if (entity.class) {
      group.entity.attr('class', entity.class);
    }

    group
      .plain(entity.text)
      .cx(14)
      .cy(entity.height / 2 + 6)
      .attr({fill: entity.color});

    group.move(entity.x, entity.y);
  }

  function _renderLabels() {
    if (_json.labels && _json.labels.length > 0) {
      _json.labels.forEach(l => {
        _draw.labels.text(l.value).x(l.x).y(l.y);
      });
    }
  }

  function _renderPolylines(_draw, _lines) {
    _lines.forEach(line => _renderOnePolyline(_draw, line));
  }

  function _renderOnePolyline(_draw, line) {
    let polyline = '';

    const line_color = line.color || '#4c56cb';
    const from = _draw.findOne('#' + line.from.element);
    const to = _draw.findOne('#' + line.to.element);
    const pointsInBetween = _calculatePointsInBetween(line, from, to);

    //start point
    polyline += _calculateX(from, line.from.point) + ',' + _calculateY(from, line.from.point) + ' ';

    // points between them
    pointsInBetween.forEach(p => (polyline += p.x + ',' + p.y + ' '));

    if (line.to.point === 'top') {
      polyline += _calculateX(to, line.to.point) + ',' + _calculateY(to, line.to.point) + ' ';
    } else if (line.to.point === 'bottom') {
      polyline += _calculateX(to, line.to.point) + ',' + _calculateY(to, line.to.point) + ' ';
    } else {
      polyline += _calculateX(to, line.to.point) + ',' + _calculateY(to, line.to.point) + ' ';
    }

    if (!line.polyline) {
      line.polyline = _draw.lines.polyline(polyline).fill('none').stroke({color: line_color, width: 2, linecap: 'round', linejoin: 'round'}).attr('id', line.id);
    } else {
      line.polyline.plot(polyline);
    }
  }

  function _calculatePointsInBetween(line, from, to) {
    const pointsInBetween = [];

    const y1 = _calculateY(from, line.from.point);
    const y2 = _calculateY(to, line.to.point);
    const x1 = _calculateX(from, line.from.point);
    const x2 = _calculateX(to, line.to.point);

    const p1 = _translatePositionToNumber(line.from.point);
    const p2 = _translatePositionToNumber(line.to.point);
    const code = p1 - p2;

    // same position
    if (code === 0) {
      if (line.from.point === 'top') {
        if (y1 <= y2) {
          pointsInBetween.push({x: x1, y: y1 - 20});
          pointsInBetween.push({x: x2, y: y1 - 20});
        } else {
          pointsInBetween.push({x: x1, y: y2 - 20});
          pointsInBetween.push({x: x2, y: y2 - 20});
        }
      } else if (line.from.point === 'bottom') {
        if (y1 <= y2) {
          pointsInBetween.push({x: x1, y: y2 + 20});
          pointsInBetween.push({x: x2, y: y2 + 20});
        } else {
          pointsInBetween.push({x: x1, y: y1 + 20});
          pointsInBetween.push({x: x2, y: y1 + 20});
        }
      } else {
        if (x1 <= x2) {
          pointsInBetween.push({x: x2 + 20, y: y1});
          pointsInBetween.push({x: x2 + 20, y: y2});
        } else {
          pointsInBetween.push({x: x1 + 20, y: y1});
          pointsInBetween.push({x: x1 + 20, y: y2});
        }
      }
    }

    // on the opposite site
    if (code === 2 || code === -2) {
      // top or bottom
      if (x1 !== x2) {
        pointsInBetween.push({x: x1, y: y2 + (y1 - y2) / 2});
        pointsInBetween.push({x: x2, y: y2 + (y1 - y2) / 2});
      }
    }

    // corner cases
    if (code === 1 || code === -1 || code === 3 || code === -3) {
      if (line.from.point === 'top') {
        if (y1 < y2 + 20) {
          pointsInBetween.push({x: x1, y: y1 - 20});
          pointsInBetween.push({x: x2 + 20, y: y1 - 20});
          pointsInBetween.push({x: x2 + 20, y: y2});
        } else {
          pointsInBetween.push({x: x1, y: y2});
        }
      }

      if (line.from.point === 'bottom') {
        if (y1 > y2 - 20) {
          pointsInBetween.push({x: x1, y: y1 + 20});
          pointsInBetween.push({x: x2 + 20, y: y1 + 20});
          pointsInBetween.push({x: x2 + 20, y: y2});
        } else {
          pointsInBetween.push({x: x1, y: y2});
        }
      }
    }

    return pointsInBetween;
  }

  function _translatePositionToNumber(position) {
    switch (position) {
      case 'top':
        return 0;
      case 'bottom':
        return 2;
      default:
        return 3;
    }
  }

  function _calculateX(group, position) {
    const width = group.entity.attr('width');
    const x = group.entity.attr('x');

    switch (position) {
      case 'top':
      case 'bottom':
        return x + width / 2;
      default:
        return x - width / 2;
    }
  }

  function _calculateY(group, position) {
    const height = group.entity.attr('height');
    const y = group.entity.attr('y');

    switch (position) {
      case 'top':
        return y;
      case 'bottom':
        return y + height;
      default:
        return y;
    }
  }

  function _update() {
    //clean up
    _draw.entities.forEach(entity => entity.remove());
    _draw.entities = [];

    _lines = [];

    // default values
    if (!_json.labels) {
      _json.labels = [];
    }

    _json.labels = _json.labels.map(l => {
      return {
        id: l.id,
        value: l.value ? l.value : '',
        x: l.x ? l.x : 0,
        y: l.y ? l.y : 0,
        color: l.color ? l.color : 'black',
      };
    });

    _json.entities.map(entity => {
      entity.type = entity.type ? entity.type : 'entity';

      if (entity.type === 'operation') {
        entity.height = entity.width;
      }
    });

    _renderLabels();

    _json.entities.forEach(entity => _renderEntities(_draw, entity));
    _lines = _json.lines; // needed to have no circular dependencies

    _renderPolylines(_draw, _lines);
  }

  function update(json) {
    _json = json;
    _update();
  }

  return {
    initalize,
    update,
  };
}
