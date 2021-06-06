import * as t from "io-ts";
import { GuildPluginData } from "knub";
import { ActionError } from "../ActionError";
import { CustomEventsPluginType, TCustomEvent } from "../types";

export const SetChannelPermissionOverridesAction = t.type({
  type: t.literal("set_channel_permission_overrides"),
  channel: t.string,
  overrides: t.array(
    t.type({
      type: t.union([t.literal("member"), t.literal("role")]),
      id: t.string,
      allow: t.number,
      deny: t.number,
    }),
  ),
});
export type TSetChannelPermissionOverridesAction = t.TypeOf<typeof SetChannelPermissionOverridesAction>;

export async function setChannelPermissionOverridesAction(
  pluginData: GuildPluginData<CustomEventsPluginType>,
  action: TSetChannelPermissionOverridesAction,
  values: any,
  event: TCustomEvent,
  eventData: any,
) {
  const channel = pluginData.guild.channels.cache.get(action.channel);
  if (!channel) {
    throw new ActionError(`Unknown channel: ${action.channel}`);
  }

  for (const override of action.overrides) {
    await channel.overwritePermissions(
      [{ id: override.id, allow: BigInt(override.allow), deny: BigInt(override.deny), type: override.type }],
      `Custom event: ${event.name}`,
    );
  }
}
