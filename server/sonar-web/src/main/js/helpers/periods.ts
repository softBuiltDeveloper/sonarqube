/*
 * SonarQube
 * Copyright (C) 2009-2018 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
import { translate, translateWithParameters } from './l10n';
import { parseDate } from './dates';

export enum PeriodMode {
  Days = 'days',
  Date = 'date',
  Version = 'version',
  PreviousAnalysis = 'previous_analysis',
  PreviousVersion = 'previous_version'
}

export interface Period {
  date: string;
  index: number;
  mode: PeriodMode;
  modeParam?: string;
  parameter?: string;
}

function getPeriod(periods: Period[] | undefined, index: number) {
  if (!Array.isArray(periods)) {
    return undefined;
  }

  return periods.find(period => period.index === index);
}

export function getLeakPeriod(periods: Period[] | undefined) {
  return getPeriod(periods, 1);
}

export function getPeriodLabel(
  period: Period | undefined,
  dateFormatter: (date: string) => string
) {
  if (!period) {
    return undefined;
  }

  let parameter = period.modeParam || period.parameter;
  if (period.mode === PeriodMode.PreviousVersion && !parameter) {
    return translate('overview.period.previous_version_only_date');
  }

  if (period.mode === PeriodMode.Date && parameter) {
    parameter = dateFormatter(parameter);
  }

  return translateWithParameters(`overview.period.${period.mode}`, parameter || '');
}

export function getPeriodDate(period?: { date?: string }): Date | undefined {
  return period && period.date ? parseDate(period.date) : undefined;
}
