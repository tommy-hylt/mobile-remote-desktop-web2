export class SocketClient {
  private ws: WebSocket | null = null;
  private responders = new Set<(msg: unknown) => boolean>();

  connect() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    this.ws = new WebSocket(`${protocol}//${host}/ws`);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      let data: unknown;
      if (typeof event.data === 'string') {
        try {
          data = JSON.parse(event.data);
        } catch {
          return;
        }
      } else {
        data = event.data;
      }

      const currentResponders = new Set(this.responders);
      for (const respond of currentResponders) {
        if (respond(data)) {
          this.responders.delete(respond);
        }
      }
    };

    this.ws.onclose = () => {
      setTimeout(() => this.connect(), 1000);
    };

    this.ws.onerror = (error) => {
      console.error(error);
    };
  }

  fetch(request: unknown, respond?: (msg: unknown) => boolean) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      if (respond) {
        this.responders.add(respond);
      }
      this.ws.send(JSON.stringify(request));
    } else {
      console.warn('WebSocket not connected, dropping request', request);
    }
  }
}
