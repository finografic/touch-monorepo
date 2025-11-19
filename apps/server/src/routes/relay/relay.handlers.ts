import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';

import type { AppRouteHandler } from 'types/app.types';
import { USBRelayService } from '../../services/usbrelay.service';
import type {
  DisconnectRelayRoute,
  GetRelayStateRoute,
  GetRelayStatesRoute,
  GetRelayStatusRoute,
  InitializeRelayRoute,
  ReconnectRelayRoute,
  ToggleRelayRoute,
  TurnAllRelaysOffRoute,
  TurnAllRelaysOnRoute,
} from './relay.routes';

// @ts-ignore - Avoiding complex type inference issue
export const toggleRelay: AppRouteHandler<ToggleRelayRoute> = async (context) => {
  try {
    const { slotNumber, state } = context.req.valid('param');

    if (isNaN(slotNumber) || slotNumber < 1 || slotNumber > 8) {
      return context.json(
        {
          success: false,
          error: 'Invalid slot number. Must be between 1-8.',
        },
        HttpStatusCodes.BAD_REQUEST,
      );
    }

    await USBRelayService.toggleRelay(slotNumber, state);

    return context.json({
      success: true,
      slotNumber,
      state,
      message: `Relay ${slotNumber} turned ${state ? 'ON' : 'OFF'}`,
    });
  } catch (error) {
    console.error('Relay toggle error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to toggle relay';
    return context.json(
      {
        success: false,
        error: errorMessage,
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

// @ts-ignore - Avoiding complex type inference issue
export const getRelayStates: AppRouteHandler<GetRelayStatesRoute> = async (context) => {
  try {
    const states = USBRelayService.getAllRelayStates();
    return context.json({
      success: true,
      states,
      count: states.length,
    });
  } catch (error) {
    console.error('Get relay states error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to get relay states';
    return context.json(
      {
        success: false,
        error: errorMessage,
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

// @ts-ignore - Avoiding complex type inference issue
export const getRelayState: AppRouteHandler<GetRelayStateRoute> = async (context) => {
  try {
    const { slotNumber } = context.req.valid('param');

    if (isNaN(slotNumber) || slotNumber < 1 || slotNumber > 8) {
      return context.json(
        {
          success: false,
          error: 'Invalid slot number. Must be between 1-8.',
        },
        HttpStatusCodes.BAD_REQUEST,
      );
    }

    const state = USBRelayService.getRelayState(slotNumber);
    return context.json({
      success: true,
      slotNumber,
      state,
      message: `Relay ${slotNumber} is ${state ? 'ON' : 'OFF'}`,
    });
  } catch (error) {
    console.error('Get relay state error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to get relay state';
    return context.json(
      {
        success: false,
        error: errorMessage,
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

// @ts-ignore - Avoiding complex type inference issue
export const getRelayStatus: AppRouteHandler<GetRelayStatusRoute> = async (context) => {
  try {
    const status = USBRelayService.getConnectionStatus();
    return context.json({
      success: true,
      ...status,
    });
  } catch (error) {
    console.error('Get relay status error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to get relay status';
    return context.json(
      {
        success: false,
        error: errorMessage,
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

// @ts-ignore - Avoiding complex type inference issue
export const turnAllRelaysOn: AppRouteHandler<TurnAllRelaysOnRoute> = async (context) => {
  try {
    for (let i = 1; i <= 8; i++) {
      await USBRelayService.toggleRelay(i, true);
    }

    return context.json({
      success: true,
      message: 'All relays turned ON',
    });
  } catch (error) {
    console.error('Turn all relays ON error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to turn all relays ON';
    return context.json(
      {
        success: false,
        error: errorMessage,
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

// @ts-ignore - Avoiding complex type inference issue
export const turnAllRelaysOff: AppRouteHandler<TurnAllRelaysOffRoute> = async (context) => {
  try {
    for (let i = 1; i <= 8; i++) {
      await USBRelayService.toggleRelay(i, false);
    }

    return context.json({
      success: true,
      message: 'All relays turned OFF',
    });
  } catch (error) {
    console.error('Turn all relays OFF error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to turn all relays OFF';
    return context.json(
      {
        success: false,
        error: errorMessage,
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

// @ts-ignore - Avoiding complex type inference issue
export const reconnectRelay: AppRouteHandler<ReconnectRelayRoute> = async (context) => {
  try {
    const connected = await USBRelayService.ensureConnection();

    if (connected) {
      return context.json({
        success: true,
        message: 'Successfully reconnected to relay board',
      });
    } else {
      return context.json(
        {
          success: false,
          error: 'Failed to reconnect to relay board',
        },
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  } catch (error) {
    console.error('Reconnect error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to reconnect';
    return context.json(
      {
        success: false,
        error: errorMessage,
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

// @ts-ignore - Avoiding complex type inference issue
export const disconnectRelay: AppRouteHandler<DisconnectRelayRoute> = async (context) => {
  try {
    await USBRelayService.disconnect();

    return context.json({
      success: true,
      message: 'Successfully disconnected from relay board',
    });
  } catch (error) {
    console.error('Disconnect error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to disconnect';
    return context.json(
      {
        success: false,
        error: errorMessage,
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

// @ts-ignore - Avoiding complex type inference issue
export const initializeRelay: AppRouteHandler<InitializeRelayRoute> = async (context) => {
  try {
    const initialized = await USBRelayService.initialize();

    return context.json({
      success: true,
      message: initialized ? 'Relay service initialized successfully' : 'Relay service already initialized',
      initialized,
    });
  } catch (error) {
    console.error('Initialize relay error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to initialize relay service';
    return context.json(
      {
        success: false,
        error: errorMessage,
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};
